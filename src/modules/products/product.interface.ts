/* =========================
 * PARAMS / OPTIONS
 * ========================= */

export interface ProductParams {
  uid: string;
}

export interface GetProductsOptions {
  page?: number;
  limit?: number;
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
    isSoled?: boolean;
  };
  styles?: string[];
  image?: {
    base64: string;
    isMain?: boolean;
  };
}
