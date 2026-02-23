import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/client';
import {
  CreateProductUseCase,
  GetProductsOptions,
  UpdateProductUseCase,
} from './Product.interface';
import { PhotosService } from 'src/modules/photos/Photos.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly photosService: PhotosService,
  ) {}

  /* =========================
   * CREATE
   * ========================= */
  async createProductUseCase(data: CreateProductUseCase) {
    const { product, styles, images, authors } = data;

    /**
     * FASE 1️⃣ — Crear imágenes (fuera de transacción)
     */
    const photoResults: { uid: string; isMain: boolean }[] = [];

    const savePhoto = async (
      images: {
        base64: string;
        name: string;
        folder: string;
        isMain?: boolean;
      }[],
    ) => {
      for (const image of images) {
        const photo = await this.photosService.createPhotoUseCase({
          base64: image.base64,
          name: image.name,
          folder: image.folder,
        });

        photoResults.push({
          uid: photo.uid,
          isMain: image.isMain ?? false,
        });
      }

      /* Garantizar una sola imagen principal */
      if (photoResults.length) {
        const hasMain = photoResults.some((p) => p.isMain);
        if (!hasMain) {
          photoResults[0].isMain = true;
        }
      }
    };

    /* Convertir price a Decimal */
    const parsedProduct = {
      ...product,
      price:
        product.price !== undefined ? new Decimal(product.price) : undefined,
    };

    /**
     * FASE 2️⃣ — Transacción
     */
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Producto
      const createdProduct = await tx.products.create({
        data: parsedProduct,
        select: { uid: true },
      });

      // 2️⃣ Autores
      if (authors?.length) {
        await tx.userProduct.createMany({
          data: authors.map((author) => ({
            userId: author.userId,
            productId: createdProduct.uid,
            isAuthor: author.isAuthor ?? false,
          })),
          skipDuplicates: true,
        });
      }

      // 3️⃣ Estilos
      if (styles?.length) {
        await tx.productStyle.createMany({
          data: styles.map((styleId) => ({
            productId: createdProduct.uid,
            styleId,
          })),
          skipDuplicates: true,
        });
      }

      // 4️⃣ Relación producto ↔ imágenes
      if (images?.length) {
        await savePhoto(images);
        await tx.productPhoto.createMany({
          data: photoResults.map((photo) => ({
            productId: createdProduct.uid,
            photoId: photo.uid,
            isMain: photo.isMain,
          })),
        });
      }

      return {
        uid: createdProduct.uid,
        photos: photoResults.map((p) => ({
          uid: p.uid,
          isMain: p.isMain,
        })),
      };
    });
  }

  /* =========================
   * READ
   * ========================= */
  async getAll(options: GetProductsOptions = {}) {
    const { page = 1, limit = 10 } = options;

    return this.prisma.products.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          select: {
            photo: {
              select: {
                uid: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });
  }

  async getGalleryHome(options: GetProductsOptions = {}) {
    const { page = 1, limit = 10 } = options;

    return this.prisma.products.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        uid: true,
        name: true,
        photos: {
          where: { isMain: true },
          select: {
            photo: {
              select: {
                uid: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });
  }

  async getById(uid: string) {
    const product = await this.prisma.products.findUnique({
      where: { uid },
      include: {
        photos: {
          select: {
            photo: {
              select: {
                uid: true,
                name: true,
                url: true,
              },
            },
            isMain: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getAllByGroup(groupId: string, options: GetProductsOptions = {}) {
    const { page = 1, limit = 10 } = options;

    return this.prisma.products.findMany({
      where: { groupId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          select: {
            photo: {
              select: {
                uid: true,
                name: true,
                url: true,
              },
            },
            isMain: true,
          },
        },
      },
    });
  }

  async getAllByAuthor(authorId: string, options: GetProductsOptions = {}) {
    const { page = 1, limit = 10 } = options;

    return this.prisma.products.findMany({
      where: {
        authors: {
          some: { userId: authorId },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          where: { isMain: true },
          select: {
            photo: {
              select: {
                uid: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });
  }

  /* =========================
   * UPDATE
   * ========================= */
  async updateProductUseCase(data: UpdateProductUseCase) {
    const { productId, data: updateData, image, styles } = data;

    const product = await this.prisma.products.findUnique({
      where: { uid: productId },
      include: {
        photos: {
          select: {
            uid: true,
            photoId: true,
            isMain: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    /**
     * FASE 1️⃣ — Imagen (fuera de transacción)
     * Solo se reemplaza el binario
     */
    if (image) {
      const mainPhoto = product.photos.find((p) => p.isMain);

      if (!mainPhoto) {
        throw new NotFoundException('Main product photo not found');
      }

      await this.photosService.updatePhotoUseCase(mainPhoto.photoId, {
        base64: image.base64,
      });
    }

    /* Convierte el precio de number a Decimal si está definido */
    const parsedData = {
      ...updateData,
      price:
        updateData.price !== undefined
          ? new Decimal(updateData.price)
          : undefined,
    };

    /**
     * FASE 2️⃣ — Transacción DB
     */
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Update producto
      await tx.products.update({
        where: { uid: productId },
        data: parsedData,
      });

      // 2️⃣ Update relación imagen (isMain)
      if (image?.isMain !== undefined) {
        await tx.productPhoto.updateMany({
          where: { productId },
          data: { isMain: false },
        });

        const mainPhoto = product.photos.find((p) => p.isMain);
        if (mainPhoto) {
          await tx.productPhoto.update({
            where: { uid: mainPhoto.uid },
            data: { isMain: image.isMain },
          });
        }
      }

      // 3️⃣ Estilos
      if (styles) {
        await tx.productStyle.deleteMany({
          where: { productId },
        });

        if (styles.length) {
          await tx.productStyle.createMany({
            data: styles.map((styleId) => ({
              productId,
              styleId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return { uid: productId };
    });
  }

  /* =========================
   * DELETE
   * ========================= 
  async deleteProduct(productId: string) {
    return this.prisma.products.delete({
      where: { uid: productId },
    });
  }
  */
}
