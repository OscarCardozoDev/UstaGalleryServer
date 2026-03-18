import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { hashText, verifyText } from 'src/utils/crypto.util';
import { CreateCredentialDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  async login(
    @Body() auth: CreateCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const credential = await this.authService.getCredentialByEmail(auth.mail);
    const isProduction =
      this.configService.get<string>('config.nodeEnv') === 'production';

    if (!credential) {
      throw new HttpException('Email not found', 404);
    }

    const isValid = await verifyText(auth.password, credential.password);
    if (!isValid) {
      throw new UnauthorizedException('Password not match');
    }

    const token = await this.jwtService.signAsync({ uid: credential.uid });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: 'Login successful',
      hasProfile: credential.hasProfile,
      hasGroup: credential.hasGroup,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario' })
  async register(
    @Body() auth: CreateCredentialDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    auth.password = await hashText(auth.password);

    const { uid } = await this.authService.setCredentialData(auth);
    const isProduction =
      this.configService.get<string>('config.nodeEnv') === 'production';

    const token = await this.jwtService.signAsync({ uid });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'User registered successfully' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out' };
  }
}
