/* =========================
 * PARAMS
 * ========================= */
export interface PhotoParams {
  uid: string;
}

/* =========================
 * RESPONSES
 * ========================= */
export interface PhotoResponse {
  uid: string;
  name: string;
  url?: string;
}

export interface GetPhotoResponse {
  uid: string;
  name: string;
  url: string;
}

/* =========================
 * CASOS DE USO
 * ========================= */

export interface CreatePhotoUseCase {
  base64: string;
  name: string;
  folder: string;
}

export interface UpdatePhotoUseCase {
  base64: string;
}
