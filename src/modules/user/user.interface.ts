export interface User {
  uid: string;
  userType: userTypeId;
  name: string;
  lastName: string;
  telNumber: string;
  isActive: boolean;
}

export interface userTypeId {
  uid: string;
  name?: string;
}

export interface UserUidResult {
  uid: string;
}

export class UpdateUserDto {
  name?: string;
  lastName?: string;
  telNumber?: string;
}
