import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialDto, GetCredentialDto } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async getCredentialByEmail(email: string): Promise<GetCredentialDto | null> {
    return this.prismaService.credentials.findUnique({
      where: { email },
      select: {
        uid: true,
        password: true,
      },
    });
  }

  async setCredentialData(auth: CreateCredentialDto): Promise<{ uid: string }> {
    return this.prismaService.credentials.create({
      data: auth,
      select: {
        uid: true,
      },
    });
  }

  async putPasswordByEmail(auth: CreateCredentialDto): Promise<void> {
    await this.prismaService.credentials.update({
      where: { email: auth.email },
      data: { password: auth.password },
    });
  }
}
