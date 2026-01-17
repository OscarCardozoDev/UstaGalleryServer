export interface Style {
  uid: string;
  name: string;
  description: string;
  groupId: string;
}

export interface StyleUidResult {
  uid: string;
}

export class UpdateStyleDto {
  name?: string;
  description?: string;
}
