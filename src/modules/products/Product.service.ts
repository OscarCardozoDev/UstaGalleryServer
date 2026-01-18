import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SaveProductData,
  ProductParams,
  ProductResponse,
} from './product.interface';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  //TODO: que no se me olvide hacer primero el modulo de estilos

  /**
   * Guarda únicamente los datos base del producto
   */
  async saveProduct(data: SaveProductData): Promise<ProductParams> {
    try {
      return await this.prismaService.products.create({
        data,
        select: {
          uid: true,
        },
      });
    } catch {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  /**
   * Obtiene un producto por id
   */
  async getProduct(productId: string): Promise<ProductResponse> {
    try {
      const product = await this.prismaService.products.findUnique({
        where: { uid: productId },
        select: {
          uid: true,
          name: true,
          description: true,
          price: true,
          isSoled: true,
          madeAt: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch {
      throw new InternalServerErrorException('Error fetching product');
    }
  }
}
