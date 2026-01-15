export interface Products {
  uid: number;
  name: string;
  description: string;
  madeAt: string;
  groupId: string;
  price?: number;
  isSoled: boolean;
  imageId?: string;

  createAt: Date;
  updateAt: Date;
}

export interface ProductStyles {
  uid: number;
  name: string;
}

export interface Photos {
  uid: number;
  name: string;
  url: string;
}

export interface Events {
  uid: number;
  name: string;
  description: string;
  date: Date;
  url: string;
}
