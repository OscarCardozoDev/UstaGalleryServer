import { Decimal } from '@prisma/client/runtime/client';

export interface SaveProductData {
  name: string;
  description: string;
  price?: Decimal | null;
  isSoled?: boolean;
  madeAt: Date;
  authorId: string;
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

// ------------------------- CASOS DE USO ------------------------- //

export interface CreateProductUseCase {
  product: {
    name: string;
    description: string;
    price?: Decimal;
    madeAt: Date;
    groupId: string;
  };
  authorId: string;
  styles?: string[];
  image?: {
    base64: string;
    name: string;
    folder: string;
    isMain?: boolean;
  };
}
