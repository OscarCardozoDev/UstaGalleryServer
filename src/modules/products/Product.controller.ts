import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { ProductService } from './Product.service';
import {
  CreateProductDto,
  ApproveManyDto,
  UpdateProductStatusDto,
  UpdateProductDto,
  GetProductsDto,
  ProductParamsDto,
} from './Product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  // ─── CREATE ───────────────────────────────────────────────────────────────

  @Post('create')
  @ApiOperation({ summary: 'Crear una obra' })
  @Roles('student', 'professor')
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

  // ─── READ ─────────────────────────────────────────────────────────────────

  @Get('getAll')
  @ApiOperation({ summary: 'Obtener todas las obras paginadas' })
  @Roles('professor')
  async getAll(@Query() query: GetProductsDto) {
    return this.productsService.getAll(query);
  }

  @Get('getGalleryHome')
  @ApiOperation({ summary: 'Obtener obras para galería home' })
  async getGalleryHome(@Query() query: GetProductsDto) {
    return this.productsService.getGalleryHome(query);
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

  @Get('get/:uid')
  @ApiOperation({ summary: 'Obtener obra por ID' })
  async getById(@Param() params: ProductParamsDto) {
    const product = await this.productsService.getById(params.uid);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────

  @Put('approveMany')
  @Roles('professor')
  @ApiOperation({ summary: 'Aprobar varias obras seleccionadas a la vez' })
  approveManyProducts(@Body() dto: ApproveManyDto) {
    return this.productsService.approveMany(dto.productIds);
  }

  @Patch('status/:uid')
  @Roles('professor')
  @ApiOperation({ summary: 'Aprobar o negar una obra individual' })
  updateProductStatus(
    @Param('uid', new ParseUUIDPipe()) uid: string,
    @Body() dto: UpdateProductStatusDto,
  ) {
    return this.productsService.updateStatus({
      uid,
      status: dto.status,
      feedback: dto.feedback,
    });
  }

  @Put('update/:uid')
  @Roles('student', 'professor')
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
