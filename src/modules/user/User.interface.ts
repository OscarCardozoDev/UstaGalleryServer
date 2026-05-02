export interface User {
  uid: string;
  name: string;
  lastName: string;
  username: string;
  description?: string | null;
  gender: string;
  telNumber: string;
  isActive: boolean;
  userTypeId: string;
  photoId?: string | null;
}

export interface AuthorInfo {
  uid: string;
  name: string;
  lastName: string;
  username: string;
  description?: string | null;
  photoId?: string | null;
  photo?: { uid: string; url?: string } | null;
}

export interface UserWithRelations extends User {
  userType?: { uid: string; name?: string } | null;
  photo?: { uid: string; url?: string } | null;
  groups?: { group: { uid: string; name?: string } }[] | null;
}

export interface CreateUserUseCase {
  uid: string;
  user: {
    name: string;
    lastName: string;
    username: string;
    description?: string;
    gender: string;
    telNumber: string;
    userTypeId: string;
  };
  photo?: {
    base64: string;
    name: string;
    folder: string;
  };
}

export interface UpdateUserUseCase {
  name?: string;
  lastName?: string;
  username?: string;
  description?: string;
  gender?: string;
  telNumber?: string;
  userTypeId?: string;
}

export interface UserUidResult {
  uid: string;
  photo?: { uid: string };
}
