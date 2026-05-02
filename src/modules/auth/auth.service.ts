import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialDto } from './auth.dto';
import { GetCredentialResult } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getCredentialByEmail(
    mail: string,
  ): Promise<GetCredentialResult | null> {
    const credential = await this.prismaService.credentials.findUnique({
      where: { mail },
      select: {
        uid: true,
        password: true,
        isEmailVerified: true,
      },
    });

    if (!credential) return null;

    const userProfile = await this.prismaService.users.findUnique({
      where: { uid: credential.uid },
      select: { userTypeId: true },
    });
    const hasGroup = await this.prismaService.usersGroups.findFirst({
      where: { userId: credential.uid },
    });

    return {
      ...credential,
      hasProfile: Boolean(userProfile),
      hasGroup: Boolean(hasGroup),
      userTypeId: userProfile?.userTypeId ?? null,
    };
  }

  async setCredentialData(auth: CreateCredentialDto): Promise<{ uid: string }> {
    return this.prismaService.credentials.create({
      data: auth,
      select: { uid: true },
    });
  }

  async putPasswordByEmail(auth: CreateCredentialDto): Promise<void> {
    await this.prismaService.credentials.update({
      where: { mail: auth.mail },
      data: { password: auth.password },
    });
  }

  async sendVerificationCode(uid: string): Promise<void> {
    const resendKey = this.configService.get<string>('config.resendKey');
    const resend = new Resend(resendKey);

    const credential = await this.prismaService.credentials.findUnique({
      where: { uid },
      select: { mail: true },
    });

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada');
    }

    await this.prismaService.verificationCodes.updateMany({
      where: { credentialUid: uid, usedAt: null },
      data: { usedAt: new Date() },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prismaService.verificationCodes.create({
      data: { credentialUid: uid, code, expiresAt },
    });

    const { error } = await resend.emails.send({
      from: 'UstaGallery <onboarding@resend.dev>',
      to: credential.mail,
      subject: 'Código de verificación - UstaGallery',
      text: `Tu código de verificación es: ${code}\n\nEste código expira en 10 minutos.`,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Error al enviar el correo');
    }
  }

  async verifyEmailCode(
    uid: string,
    code: string,
  ): Promise<{ verified: boolean }> {
    const record = await this.prismaService.verificationCodes.findFirst({
      where: {
        credentialUid: uid,
        code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new BadRequestException('Código inválido o expirado');
    }

    await this.prismaService.verificationCodes.update({
      where: { uid: record.uid },
      data: { usedAt: new Date() },
    });

    await this.prismaService.credentials.update({
      where: { uid },
      data: { isEmailVerified: true },
    });

    return { verified: true };
  }
}
