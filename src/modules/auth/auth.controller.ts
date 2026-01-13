import {
  Controller,
  Post,
  Body,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { hashText, verifyText } from 'src/utils/crypto.util';
import type { CreateCredentialDto } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() auth: CreateCredentialDto) {
    const credential = await this.authService.getCredentialByEmail(auth.email);

    if (!credential) {
      throw new HttpException('Email not found', 404);
    }

    const isValid = await verifyText(auth.password, credential.password);
    if (!isValid) {
      throw new UnauthorizedException('Password not match');
    }

    return {
      access_token: await this.jwtService.signAsync({
        uid: credential.uid,
      }),
    };
  }

  @Post('register')
  async register(@Body() auth: CreateCredentialDto) {
    auth.password = await hashText(auth.password);

    const { uid } = await this.authService.setCredentialData(auth);

    return {
      access_token: await this.jwtService.signAsync({ uid }),
    };
  }
}
