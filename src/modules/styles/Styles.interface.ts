import { Category } from 'src/generated/prisma/enums';

export { Category };
export const CategoryValues = Object.values(Category);

export interface Style {
  uid: string;
  name: string;
  description: string;
  groupId: string;
  category: Category;
}

export interface StyleUidResult {
  uid: string;
}

// Contrato interno del servicio para crear
export interface CreateStyleUseCase {
  name: string;
  description: string;
  groupId: string;
  category: Category;
}

// Contrato interno del servicio para actualizar
export interface UpdateStyleUseCase {
  name?: string;
  description?: string;
  category?: Category;
}
