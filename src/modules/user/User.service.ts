import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotosService } from 'src/modules/photos/Photos.service';
import {
  CreateUserUseCase,
  UserWithRelations,
  UserUidResult,
} from './User.interface';
import { UpdateUserDto } from './User.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private photosService: PhotosService,
  ) {}

  /**
   * ========================
   * GET ACTIVE USERS
   * ========================
   */
  async getActiveUsers(): Promise<UserWithRelations[]> {
    const users = await this.prismaService.users.findMany({
      where: { isActive: true },
      select: {
        uid: true,
        name: true,
        lastName: true,
        username: true,
        description: true,
        gender: true,
        idCard: true,
        degree: true,
        semester: true,
        telNumber: true,
        isActive: true,
        isProfesor: true,
        userTypeId: true,
        photoId: true,
        userType: {
          select: {
            uid: true,
            name: true,
          },
        },
        photo: {
          select: {
            uid: true,
            url: true,
          },
        },
        groups: {
          select: {
            group: {
              select: {
                uid: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return users;
  }

  /**
   * ========================
   * GET USER BY UID
   * ========================
   */
  async getUser(uid: string): Promise<UserWithRelations> {
    const user = await this.prismaService.users.findUnique({
      where: { uid },
      select: {
        uid: true,
        name: true,
        lastName: true,
        username: true,
        description: true,
        gender: true,
        idCard: true,
        degree: true,
        semester: true,
        telNumber: true,
        isActive: true,
        isProfesor: true,
        userTypeId: true,
        photoId: true,
        userType: {
          select: {
            uid: true,
            name: true,
          },
        },
        photo: {
          select: {
            uid: true,
            url: true,
          },
        },
        groups: {
          select: {
            group: {
              select: {
                uid: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    return user;
  }

  /**
   * ========================
   * CREATE USER (Use Case)
   * ========================
   */
  async createUserUseCase(data: CreateUserUseCase): Promise<UserUidResult> {
    const { uid, user, photo } = data;

    /**
     * FASE 1️⃣ — Crear foto (fuera de transacción)
     */
    let photoResult: { uid: string } | null = null;

    if (photo) {
      const createdPhoto = await this.photosService.createPhotoUseCase({
        base64: photo.base64,
        name: photo.name,
        folder: photo.folder,
      });
      photoResult = { uid: createdPhoto.uid };
    }

    /**
     * FASE 2️⃣ — Transacción
     */
    return this.prismaService.$transaction(async (tx) => {
      // Crear usuario
      const createdUser = await tx.users.create({
        data: {
          uid: uid,
          name: user.name,
          lastName: user.lastName,
          username: user.username,
          description: user.description,
          gender: user.gender,
          idCard: user.idCard,
          degree: user.degree,
          semester: user.semester,
          telNumber: user.telNumber,
          isProfesor: user.isProfesor ?? false,
          userType: {
            connect: { uid: user.userTypeId },
          },
          ...(photoResult && {
            photo: {
              connect: { uid: photoResult.uid },
            },
          }),
        },
        select: {
          uid: true,
        },
      });

      return {
        uid: createdUser.uid,
        ...(photoResult && { photo: photoResult }),
      };
    });
  }

  /**
   * ========================
   * UPDATE USER
   * ========================
   */
  async updateUser(
    uid: string,
    userData: UpdateUserDto,
  ): Promise<UserUidResult> {
    // Verificar que el usuario existe
    const existingUser = await this.prismaService.users.findUnique({
      where: { uid },
      select: { uid: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    // Filtrar campos undefined
    const data = {
      ...Object.fromEntries(
        Object.entries(userData).filter(([, v]) => v !== undefined),
      ),
    };

    // Manejar userTypeId si existe
    const updateData: any = { ...data };
    if (userData.userTypeId) {
      delete updateData.userTypeId;
      updateData.userType = {
        connect: { uid: userData.userTypeId },
      };
    }

    const updated = await this.prismaService.users.update({
      where: { uid },
      data: updateData,
      select: {
        uid: true,
      },
    });

    return { uid: updated.uid };
  }

  /**
   * ========================
   * UPDATE USER PHOTO
   * ========================
   */
  async updateUserPhoto(
    uid: string,
    photo: { base64: string; name: string; folder: string },
  ): Promise<UserUidResult> {
    // Verificar que el usuario existe
    const existingUser = await this.prismaService.users.findUnique({
      where: { uid },
      select: {
        uid: true,
        photoId: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    // Crear nueva foto
    const createdPhoto = await this.photosService.createPhotoUseCase({
      base64: photo.base64,
      name: photo.name,
      folder: photo.folder,
    });

    // Si había una foto anterior, podríamos eliminarla (opcional)
    // if (existingUser.photoId) {
    //   await this.photosService.deletePhoto(existingUser.photoId);
    // }

    // Actualizar usuario con nueva foto
    await this.prismaService.users.update({
      where: { uid },
      data: {
        photo: {
          connect: { uid: createdPhoto.uid },
        },
      },
    });

    return {
      uid: existingUser.uid,
      photo: { uid: createdPhoto.uid },
    };
  }

  /**
   * ========================
   * DEACTIVATE USER (Soft Delete)
   * ========================
   */
  async deactivateUser(uid: string): Promise<UserUidResult> {
    const user = await this.prismaService.users.findUnique({
      where: { uid },
      select: { uid: true },
    });

    if (!user) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    const updated = await this.prismaService.users.update({
      where: { uid },
      data: {
        isActive: false,
        finishAt: new Date(),
      },
      select: {
        uid: true,
      },
    });

    return { uid: updated.uid };
  }

  /**
   * ========================
   * REACTIVATE USER
   * ========================
   */
  async reactivateUser(uid: string): Promise<UserUidResult> {
    const user = await this.prismaService.users.findUnique({
      where: { uid },
      select: { uid: true },
    });

    if (!user) {
      throw new NotFoundException(`User with uid ${uid} not found`);
    }

    const updated = await this.prismaService.users.update({
      where: { uid },
      data: {
        isActive: true,
        finishAt: null,
      },
      select: {
        uid: true,
      },
    });

    return { uid: updated.uid };
  }
}
