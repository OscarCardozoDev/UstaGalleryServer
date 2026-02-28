import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

/* =========================
 * PARAMS / OPTIONS
 * ========================= */

export interface ProductParams {
  uid: string;
}

export class GetProductsOptions {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number = 10;
}

/* =========================
 * CASOS DE USO
 * ========================= */

export interface CreateProductUseCase {
  product: {
    name: string;
    description: string;
    price?: number;
    madeAt: Date;
    isSold?: boolean;
    groupId: string;
  };
  authors: {
    userId: string;
    isAuthor: boolean;
  }[];
  styles?: string[];
  images?: {
    base64: string;
    name: string;
    folder: string;
    isMain?: boolean;
  }[];
}

export interface UpdateProductUseCase {
  productId: string;
  data: {
    name?: string;
    description?: string;
    price?: number;
    madeAt?: Date;
    groupId?: string;
    isSold?: boolean;
  };
  styles?: string[];
  image?: {
    base64: string;
    isMain?: boolean;
  };
}
