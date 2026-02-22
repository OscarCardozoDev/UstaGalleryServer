// product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

// ─── Reutilizables ───────────────────────────────────────────

export class ProductAuthorDto {
  @ApiProperty({ example: 'aa35ee0c-f81a-4739-aa4c-af4cdfa820d3' })
  userId: string;

  @ApiProperty({ example: true })
  isAuthor: boolean;
}

export class ProductImageDto {
  @ApiProperty({ example: '/9j/4AAQSkZJRgAB...' })
  base64: string;

  @ApiProperty({ example: 'obra.jpeg' })
  name: string;

  @ApiProperty({ example: 'products' })
  folder: string;

  @ApiPropertyOptional({ example: true })
  isMain?: boolean;
}

// ─── Params ──────────────────────────────────────────────────

export class ProductParamsDto {
  @ApiProperty({ example: 'b4fa2024-0da5-49a9-bc29-2417515e118c' })
  uid: string;
}

// ─── Query ───────────────────────────────────────────────────
// Reemplaza GetProductsOptions de Product.interface.ts

export class GetProductsDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number = 10;
}

// ─── Create ──────────────────────────────────────────────────
// Reemplaza el @Body() inline del controller

export class CreateProductDto {
  @ApiProperty({ example: 'Mi hermosa novia' })
  name: string;

  @ApiProperty({ example: 'Obra hecha en acuarela' })
  description: string;

  @ApiPropertyOptional({ example: 99999 })
  price?: number;

  @ApiProperty({ example: '2025-07-29' })
  madeAt: Date;

  @ApiProperty({ example: 'b4fa2024-0da5-49a9-bc29-2417515e118c' })
  groupId: string;

  @ApiPropertyOptional({ example: false })
  isSolded?: boolean;

  @ApiProperty({ type: [ProductAuthorDto] })
  authors: ProductAuthorDto[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Expresionismo', 'Surrealismo'],
  })
  styles?: string[];

  @ApiPropertyOptional({ type: [ProductImageDto] })
  images?: ProductImageDto[];
}

// ─── Update ──────────────────────────────────────────────────

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Nuevo nombre' })
  name?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción' })
  description?: string;

  @ApiPropertyOptional({ example: 50000 })
  price?: number;

  @ApiPropertyOptional({ example: '2025-07-29' })
  madeAt?: Date;

  @ApiPropertyOptional({ example: 'b4fa2024-0da5-49a9-bc29-2417515e118c' })
  groupId?: string;

  @ApiPropertyOptional({ example: false })
  isSolded?: boolean;

  @ApiPropertyOptional({ type: [String] })
  styles?: string[];

  @ApiPropertyOptional({ example: '/9j/4AAQSkZJRgAB...' })
  base64?: string;

  @ApiPropertyOptional({ example: true })
  isMain?: boolean;
}
