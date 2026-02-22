import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedRequest, JwtPayload } from 'src/interface/jwtPayload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtSecret = this.configService.get<string>('config.jwtSecret');

    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET is not defined');
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication cookie');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtSecret,
      });

      request.user = payload; // ✔ uid disponible
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromCookies(
    request: AuthenticatedRequest,
  ): string | undefined {
    return request.cookies?.access_token;
  }
}
