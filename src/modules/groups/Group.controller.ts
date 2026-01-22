import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { GroupService } from './Group.service';
import {
  GroupParams,
  GetGroupsOptions,
  CreateGroupUseCase,
} from './Group.interface';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /* =========================
   * CREATE
   * ========================= */
  @Post('create')
  async create(
    @Body()
    createGroupUseCase: CreateGroupUseCase,
  ) {
    return this.groupService.createGroupUseCase(createGroupUseCase);
  }

  /* =========================
   * GET ALL
   * ========================= */
  @Get('get')
  async getAll(@Query() query: GetGroupsOptions) {
    return this.groupService.getAll(query);
  }

  /* =========================
   * GET BY ID
   * ========================= */
  @Get('get/:uid')
  async getById(@Param() params: GroupParams) {
    const group = await this.groupService.getById(params.uid);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  /* =========================
   * UPDATE
   * ========================= */
  @Put('update/:uid')
  async update(
    @Param() params: GroupParams,
    @Body()
    body: {
      name?: string;
      profesorId?: string;
      users?: string[];
    },
  ) {
    return this.groupService.updateGroupUseCase({
      groupId: params.uid,
      data: {
        name: body.name,
        profesorId: body.profesorId,
      },
    });
  }

  /* =========================
   * DELETE
   * ========================= */
  @Delete('delete/:uid')
  async delete(@Param() params: GroupParams) {
    await this.groupService.deleteGroup(params.uid);
    return { success: true };
  }

  /* --------------------------------------- Student Uses Cases For Groups --------------------------------------- */

  /* =========================
   * ADD STUDENT
   * ========================= */
  @Post('student/add/:groupId')
  async addStudent(
    @Param('groupId') groupId: string,
    @Body() body: { userId: string },
  ) {
    return this.groupService.addNewStudent({
      groupId,
      userId: body.userId,
    });
  }

  /* =========================
   * GET ALL STUDENTS
   * ========================= */
  @Get('student/get/:groupId')
  async getAllStudents(@Param('groupId') groupId: string) {
    return this.groupService.getAllStudentsByGroup(groupId);
  }

  /* =========================
   * DELETE ONE STUDENT
   * ========================= */
  @Delete('student/delete/:groupId')
  async deleteStudent(
    @Param('groupId') groupId: string,
    @Body() body: { userId: string },
  ) {
    await this.groupService.deleteOneStudentByGroup({
      groupId,
      userId: body.userId,
    });
    return { success: true };
  }

  /* =========================
   * DELETE ALL STUDENTS
   * ========================= */
  @Delete('student/deleteAll/:groupId')
  async deleteAllStudents(@Param('groupId') groupId: string) {
    await this.groupService.deleteStudentsByGroup(groupId);
    return { success: true };
  }

  /* =========================
   * UPDATE STUDENT LIST
   * ========================= */
  @Put('student/update/:groupId')
  async updateStudents(
    @Param('groupId') groupId: string,
    @Body() body: { users: string[] },
  ) {
    return this.groupService.updateStudentsByGroup({
      groupId,
      users: body.users,
    });
  }
}
