import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload, AuthenticatedRequest } from 'src/interface/jwtPayload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET is not defined');
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtSecret,
      });

      request.user = payload; // ✔ tipado
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) return undefined;

    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
