import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  userTypeId: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
