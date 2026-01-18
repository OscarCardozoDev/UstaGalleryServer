import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductUseCase } from './product.interface';
import { PhotosController } from 'src/modules/photos/Photos.controller';
import { StylesService } from 'src/modules/styles/Styles.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly photosController: PhotosController,
    private readonly stylesService: StylesService,
  ) {}

  /* ============================
   * ORQUESTADOR
   * ============================ */
  async createProductUseCase(
    data: CreateProductUseCase,
  ): Promise<{ uid: string; photoUid?: string }> {
    const { product, authorId, styles, image } = data;

    const createdProduct = await this.saveProduct(product);

    await this.createAuthorRelation(authorId, createdProduct.uid);

    let photoUid: string | undefined;

    if (image) {
      const photo = await this.savePhoto(image, createdProduct.uid, authorId);
      photoUid = photo.uid;

      await this.createProductPhotoRelation(createdProduct.uid, photo.uid);
    }

    if (styles?.length) {
      await this.createProductStyleRelations(createdProduct.uid, styles);
    }

    return {
      uid: createdProduct.uid,
      photoUid,
    };
  }

  /* ============================
   * FUNCIONES ATÓMICAS
   * ============================ */

  private async saveProduct(product: CreateProductUseCase['product']) {
    return this.prisma.products.create({
      data: product,
      select: { uid: true },
    });
  }

  private async createAuthorRelation(
    userId: string,
    productId: string,
  ): Promise<void> {
    await this.prisma.userProduct.create({
      data: {
        userId,
        productId,
        isAuthor: true,
      },
    });
  }

  private async savePhoto(
    image: { base64: string; folder: string },
    productId: string,
    authorId: string,
  ) {
    const name = `${productId}_${authorId}`;

    return this.photosController.createPhoto({
      base64: image.base64,
      name,
      folder: image.folder,
    });
  }

  private async createProductPhotoRelation(
    productId: string,
    photoId: string,
  ): Promise<void> {
    await this.prisma.productPhoto.create({
      data: {
        productId,
        photoId,
        isMain: true,
      },
    });
  }

  private async createProductStyleRelations(
    productId: string,
    styles: string[],
  ): Promise<void> {
    for (const styleId of styles) {
      await this.stylesService.get(styleId);

      await this.prisma.productStyle.create({
        data: {
          productId,
          styleId,
        },
      });
    }
  }
}
