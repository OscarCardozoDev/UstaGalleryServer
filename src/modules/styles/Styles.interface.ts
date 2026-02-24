// Respuesta de la DB
export interface Style {
  uid: string;
  name: string;
  description: string;
  groupId: string;
}

export interface StyleUidResult {
  uid: string;
}

// Contrato interno del servicio para crear
export interface CreateStyleUseCase {
  name: string;
  description: string;
  groupId: string;
}

// Contrato interno del servicio para actualizar
export interface UpdateStyleUseCase {
  name?: string;
  description?: string;
}
