import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedRequest, JwtPayload } from 'src/interface/jwtPayload';
import { ROLES_KEY, RoleName } from 'src/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
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

    // 1️⃣ Verificar token
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtSecret,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 2️⃣ Verificar roles si el endpoint los requiere
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3️⃣ Consultar el tipo de usuario en la DB
    const user = await this.prisma.users.findUnique({
      where: { uid: payload.uid },
      select: { userTypeId: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 4️⃣ Resolver nombre → UUID y comparar
    const hasRole = requiredRoles.some(
      (role) =>
        this.configService.get<string>(`config.roles.${role}`) ===
        user.userTypeId,
    );

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return true;
  }

  private extractTokenFromCookies(
    request: AuthenticatedRequest,
  ): string | undefined {
    return request.cookies?.access_token;
  }
}
