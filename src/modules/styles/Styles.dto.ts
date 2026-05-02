import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Category, CategoryValues } from './Styles.interface';

export class CreateStyleDto {
  @ApiProperty({ example: 'Expresionismo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Estilo caracterizado por la distorsión emocional' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'uuid-del-grupo' })
  @IsString()
  groupId: string;

  @ApiProperty({
    enum: CategoryValues,
    enumName: 'Category',
    example: 'ARTES',
  })
  @IsEnum(Category)
  category: Category;
}

export class UpdateStyleDto {
  @ApiPropertyOptional({ example: 'Surrealismo' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: CategoryValues,
    enumName: 'Category',
    example: 'ARTES',
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}

export class StyleDto {
  @ApiProperty({ example: 'uuid-del-estilo' })
  @IsOptional()
  uid?: string;

  @ApiProperty({
    enum: CategoryValues,
    enumName: 'Category',
    example: 'ARTES',
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
