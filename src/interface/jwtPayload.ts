import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  uid: string;
  userTypeId?: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
