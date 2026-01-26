import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './Product.service';
import { ProductParams, GetProductsOptions } from './product.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  // =========================
  // CREATE
  // =========================
  @Post('create')
  async create(
    @Body()
    body: {
      name: string;
      description: string;
      price?: number;
      madeAt: Date;
      groupId: string;
      isSold?: boolean;
      styles?: string[];
      authors: {
        userId: string;
        isAuthor: boolean;
      }[];
      images?: {
        base64: string;
        name: string;
        folder: string;
        isMain?: boolean;
      }[];
    },
  ) {
    return this.productsService.createProductUseCase({
      product: {
        name: body.name,
        description: body.description,
        price: body.price,
        madeAt: body.madeAt,
        groupId: body.groupId,
        isSold: body.isSold,
      },
      authors: body.authors,
      styles: body.styles,
      images: body.images,
    });
  }

  // =========================
  // GET ALL (paginado)
  // =========================
  @Get('getAll')
  async getAll(@Query() query: GetProductsOptions) {
    return this.productsService.getAll(query);
  }

  // =========================
  // GET BY ID
  // =========================
  @Get('get/:uid')
  async getById(@Param() params: ProductParams) {
    const product = await this.productsService.getById(params.uid);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // =========================
  // GET BY GROUP
  // =========================
  @Get('getGroup/:uid')
  async getAllByGroup(
    @Param('uid') groupId: string,
    @Query() query: GetProductsOptions,
  ) {
    return this.productsService.getAllByGroup(groupId, query);
  }

  // =========================
  // GET BY AUTHOR
  // =========================
  @Get('getAuthor/:uid')
  async getAllByAuthor(
    @Param('uid') authorId: string,
    @Query() query: GetProductsOptions,
  ) {
    return this.productsService.getAllByAuthor(authorId, query);
  }

  // =========================
  // UPDATE
  // =========================
  @Put('update/:uid')
  async update(
    @Param() params: ProductParams,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: number;
      madeAt?: Date;
      groupId?: string;
      isSoled?: boolean;
      styles?: string[];
      base64?: string;
      isMain?: boolean;
    },
  ) {
    return this.productsService.updateProductUseCase({
      productId: params.uid,
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        madeAt: body.madeAt,
        groupId: body.groupId,
        isSoled: body.isSoled,
      },
      styles: body.styles,
      image: body.base64
        ? {
            base64: body.base64,
            isMain: body.isMain,
          }
        : undefined,
    });
  }
}
