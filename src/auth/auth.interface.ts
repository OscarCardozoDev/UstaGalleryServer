export interface CreateCredentialDto {
  email: string;
  password: string;
}

export interface GetCredentialDto {
  uid: string;
  password: string;
}
