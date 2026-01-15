export interface PhotoPayload {
  name: string;
  url: string;
}

export interface CreatePhotoDto {
  base64: string;
  name: string;
  folder: string;
}

export interface UpdatePhotoDto {
  base64: string;
  name: string;
  folder: string;
}

export interface PhotoParams {
  uid: string;
}

export interface PhotoResponse {
  uid: string;
  name: string;
  url: string;
}

export interface GetPhotoResponse {
  uid: string;
  name: string;
  base64: string;
}
