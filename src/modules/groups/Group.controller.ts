import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/currentUser';
import { GroupService } from './Group.service';
import {
  GroupParams,
  GetGroupsOptions,
  CreateGroupUseCase,
} from './Group.interface';
import { AuthGuard } from 'src/middleware/jwt.guard';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /* =========================
   * CREATE
   * ========================= */
  @Post('create')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async delete(@Param() params: GroupParams) {
    await this.groupService.deleteGroup(params.uid);
    return { success: true };
  }

  /* --------------------------------------- Student Uses Cases For Groups --------------------------------------- */

  /* =========================
   * ADD STUDENT TO GROUP(S)
   * ========================= */
  @Post('student/add')
  @UseGuards(AuthGuard)
  async addStudent(
    @CurrentUser('uid') uid: string,
    @Body() body: { userId?: string; groupIds: string[] },
  ) {
    const userId = body.userId ?? uid;

    return this.groupService.addStudentToGroups({
      userId,
      groupIds: body.groupIds,
    });
  }

  /* =========================
   * GET ALL STUDENTS
   * ========================= */
  @Get('student/get/:groupId')
  @UseGuards(AuthGuard)
  async getAllStudents(@Param('groupId') groupId: string) {
    return this.groupService.getAllStudentsByGroup(groupId);
  }

  /* =========================
   * DELETE ONE STUDENT
   * ========================= */
  @Delete('student/delete/:groupId')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async deleteAllStudents(@Param('groupId') groupId: string) {
    await this.groupService.deleteStudentsByGroup(groupId);
    return { success: true };
  }

  /* =========================
   * UPDATE STUDENT LIST
   * ========================= */
  @Put('student/update/:groupId')
  @UseGuards(AuthGuard)
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
