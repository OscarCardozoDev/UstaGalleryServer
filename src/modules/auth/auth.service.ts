import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialDto, GetCredentialDto } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async getCredentialByEmail(mail: string): Promise<GetCredentialDto | null> {
    const credential = await this.prismaService.credentials.findUnique({
      where: { mail },
      select: {
        uid: true,
        password: true,
      },
    });

    if (!credential) {
      return null;
    }

    const hasProfile = await this.prismaService.users.findUnique({
      where: { uid: credential.uid },
    });
    const hasGroup = await this.prismaService.usersGroups.findFirst({
      where: { userId: credential.uid },
    });

    return {
      ...credential,
      hasProfile: Boolean(hasProfile),
      hasGroup: Boolean(hasGroup),
    };
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
      where: { mail: auth.mail },
      data: { password: auth.password },
    });
  }
}
