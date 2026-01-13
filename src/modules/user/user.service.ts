import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserUidResult, UpdateUserDto } from './user.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getActiveUsers(): Promise<User[]> {
    const users = await this.prismaService.users.findMany({
      where: { isActive: true },
      select: {
        uid: true,
        name: true,
        lastName: true,
        telNumber: true,
        isActive: true,
        userType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users;
  }

  async setUserData(user: User): Promise<UserUidResult> {
    const created = await this.prismaService.users.create({
      data: {
        uid: user.uid,
        name: user.name,
        lastName: user.lastName,
        telNumber: user.telNumber,
        userType: {
          connect: { id: user.userType.id },
        },
      },
      select: { uid: true },
    });

    return { uid: created.uid };
  }

  async getUser(uid: string): Promise<User> {
    const user = await this.prismaService.users.findUnique({
      where: { uid },
      select: {
        uid: true,
        name: true,
        lastName: true,
        telNumber: true,
        isActive: true,
        userType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    return user;
  }

  async updateUser(uid: string, user: UpdateUserDto): Promise<UserUidResult> {
    const data = {
      ...Object.fromEntries(
        Object.entries(user).filter(([, v]) => v !== undefined),
      ),
    };

    const updated = await this.prismaService.users.update({
      where: { uid },
      data,
      select: { uid: true },
    });

    return { uid: updated.uid };
  }
}
