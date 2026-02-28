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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductService } from './Product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  GetProductsDto,
  ProductParamsDto,
} from './Product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear una obra' })
  async create(@Body() body: CreateProductDto) {
    return this.productsService.createProductUseCase({
      product: {
        name: body.name,
        description: body.description,
        price: body.price,
        madeAt: new Date(body.madeAt),
        groupId: body.groupId,
        isSold: body.isSold,
      },
      authors: body.authors,
      styles: body.styles,
      images: body.images,
    });
  }

  @Get('getAll')
  @ApiOperation({ summary: 'Obtener todas las obras paginadas' })
  async getAll(@Query() query: GetProductsDto) {
    return this.productsService.getAll(query);
  }

  @Get('get/:uid')
  @ApiOperation({ summary: 'Obtener obra por ID' })
  async getById(@Param() params: ProductParamsDto) {
    const product = await this.productsService.getById(params.uid);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Get('getGroup/:uid')
  @ApiOperation({ summary: 'Obtener obras por grupo' })
  async getAllByGroup(
    @Param('uid') groupId: string,
    @Query() query: GetProductsDto,
  ) {
    return this.productsService.getAllByGroup(groupId, query);
  }

  @Get('getAuthor/:uid')
  @ApiOperation({ summary: 'Obtener obras por autor' })
  async getAllByAuthor(
    @Param('uid') authorId: string,
    @Query() query: GetProductsDto,
  ) {
    return this.productsService.getAllByAuthor(authorId, query);
  }

  @Get('getGalleryHome')
  @ApiOperation({ summary: 'Obtener obras para galería home' })
  async getGalleryHome(@Query() query: GetProductsDto) {
    return this.productsService.getGalleryHome(query);
  }

  @Put('update/:uid')
  @ApiOperation({ summary: 'Actualizar una obra' })
  async update(
    @Param() params: ProductParamsDto,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.updateProductUseCase({
      productId: params.uid,
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        madeAt: body.madeAt ? new Date(body.madeAt) : undefined,
        groupId: body.groupId,
        isSold: body.isSold,
      },
      styles: body.styles,
      image: body.base64
        ? { base64: body.base64, isMain: body.isMain }
        : undefined,
    });
  }
}
