import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  uid: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
