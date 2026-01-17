import { Decimal } from '@prisma/client/runtime/client';

export interface SaveProductData {
  name: string;
  description: string;
  price?: Decimal | null;
  isSoled?: boolean;
  madeAt: Date;
  groupId: string;
  imageId?: string;
}

export class CreateProductDto {
  name: string;
  description: string;
  price?: Decimal;
  madeAt: Date;
  groupId: string;

  // Imagen
  base64?: string;
  imageName?: string;
  folder?: string;
}

export interface ProductParams {
  uid: string;
}

export interface ProductResponse {
  uid: string;
  name: string;
  description: string;
  price?: Decimal | null;
  isSoled: boolean;
  madeAt: Date;
}
