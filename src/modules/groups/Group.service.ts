import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateGroupUseCase,
  UpdateGroupUseCase,
  GetGroupsOptions,
  AddStudentToGroupUseCase,
  UpdateStudentsByGroupUseCase,
  DeleteStudentByGroupUseCase,
} from './Group.interface';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  /* =========================
   * CREATE
   * ========================= */
  async createGroupUseCase(data: CreateGroupUseCase) {
    const { name, profesorId, users } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Crear grupo
      const group = await tx.groups.create({
        data: {
          name,
          profesorId,
        },
        select: { uid: true },
      });

      // 2️⃣ Profesor como miembro del grupo
      await tx.usersGroups.create({
        data: {
          userId: profesorId,
          groupId: group.uid,
        },
      });

      // 3️⃣ Usuarios iniciales
      if (users?.length) {
        await tx.usersGroups.createMany({
          data: users.map((userId) => ({
            userId,
            groupId: group.uid,
          })),
          skipDuplicates: true,
        });
      }

      return group;
    });
  }

  /* =========================
   * GET ALL
   * ========================= */
  async getAll(options: GetGroupsOptions = {}) {
    const { page = 1, limit = 10 } = options;

    return this.prisma.groups.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        profesor: {
          select: { uid: true, name: true },
        },
      },
    });
  }

  /* =========================
   * GET BY ID
   * ========================= */
  async getById(groupId: string) {
    return this.prisma.groups.findUnique({
      where: { uid: groupId },
      include: {
        profesor: {
          select: { uid: true, name: true },
        },
        users: {
          select: {
            user: { select: { uid: true, name: true } },
          },
        },
      },
    });
  }

  /* =========================
   * UPDATE
   * ========================= */
  async updateGroupUseCase(data: UpdateGroupUseCase) {
    const { groupId, data: updateData } = data;

    const group = await this.prisma.groups.findUnique({
      where: { uid: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Update grupo
      await tx.groups.update({
        where: { uid: groupId },
        data: updateData,
      });

      return { uid: groupId };
    });
  }

  /* =========================
   * DELETE
   * ========================= */
  async deleteGroup(groupId: string) {
    const group = await this.prisma.groups.findUnique({
      where: { uid: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.prisma.groups.delete({
      where: { uid: groupId },
    });

    return true;
  }

  /* --------------------------------------- Student Uses Cases For Groups --------------------------------------- */

  /* =========================
   * ADD NEW STUDENT
   * ========================= */
  async addNewStudent(data: AddStudentToGroupUseCase) {
    const { groupId, userId } = data;

    // Verificar grupo
    const group = await this.prisma.groups.findUnique({
      where: { uid: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    try {
      return await this.prisma.usersGroups.create({
        data: {
          groupId,
          userId,
        },
        select: { uid: true },
      });
    } catch {
      throw new ConflictException('User already belongs to this group');
    }
  }

  /* =========================
   * GET ALL STUDENTS BY GROUP
   * ========================= */
  async getAllStudentsByGroup(groupId: string) {
    return this.prisma.usersGroups.findMany({
      where: { groupId },
      select: {
        user: {
          select: {
            uid: true,
            name: true,
          },
        },
      },
    });
  }

  /* =========================
   * DELETE ALL STUDENTS BY GROUP
   * ========================= */
  async deleteStudentsByGroup(groupId: string) {
    return this.prisma.usersGroups.deleteMany({
      where: { groupId },
    });
  }

  /* =========================
   * DELETE ONE STUDENT BY GROUP
   * ========================= */
  async deleteOneStudentByGroup(data: DeleteStudentByGroupUseCase) {
    const { groupId, userId } = data;

    const group = await this.prisma.groups.findUnique({
      where: { uid: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.usersGroups.delete({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });
    });
  }

  /* =========================
   * UPDATE STUDENTS BY GROUP
   * ========================= */
  async updateStudentsByGroup(data: UpdateStudentsByGroupUseCase) {
    const { groupId, users } = data;

    const group = await this.prisma.groups.findUnique({
      where: { uid: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // Eliminar relaciones actuales
      await tx.usersGroups.deleteMany({
        where: { groupId },
      });

      // Crear nuevas
      if (users.length) {
        await tx.usersGroups.createMany({
          data: users.map((userId) => ({
            userId,
            groupId,
          })),
          skipDuplicates: true,
        });
      }

      return { groupId };
    });
  }
}
