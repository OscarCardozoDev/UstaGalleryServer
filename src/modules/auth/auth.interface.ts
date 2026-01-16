export interface CreateCredentialDto {
  mail: string;
  password: string;
}

export interface GetCredentialDto {
  uid: string;
  password: string;
}
