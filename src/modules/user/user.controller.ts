import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Post,
  Put,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/currentUser';
import { UserService } from './User.service';
import { CreateUserDto, UpdateUserDto, UpdateUserPhotoDto } from './User.dto';
import type { JwtPayload } from 'src/interface/jwtPayload';
import { AuthGuard } from 'src/middleware/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear perfil de usuario' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() body: CreateUserDto,
    @CurrentUser('uid') uid: string,
  ) {
    return this.userService.createUserUseCase({
      uid,
      user: {
        name: body.name,
        lastName: body.lastName,
        username: body.username,
        description: body.description,
        gender: body.gender,
        idCard: body.idCard,
        degree: body.degree,
        semester: body.semester,
        telNumber: body.telNumber,
        isProfesor: body.isProfesor,
        userTypeId: body.userTypeId,
      },
      photo: body.photo,
    });
  }

  @Get('allActive')
  @ApiOperation({ summary: 'Obtener todos los usuarios activos' })
  @Roles('admin', 'professor')
  @HttpCode(HttpStatus.OK)
  async getActiveUsers() {
    return this.userService.getActiveUsers();
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener usuario actual' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: JwtPayload) {
    return this.userService.getUser(user.uid);
  }

  @Get('author/:uid')
  @ApiOperation({ summary: 'Obtener información del usuario como autor' })
  @HttpCode(HttpStatus.OK)
  async getInfoAuthor(@Param('uid') uid: string) {
    return this.userService.getInfoAuthor(uid);
  }

  @Get(':uid')
  @ApiOperation({ summary: 'Obtener usuario por UID' })
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('uid') uid: string) {
    return this.userService.getUser(uid);
  }

  @Put('update')
  @ApiOperation({ summary: 'Actualizar usuario actual' })
  @Roles('professor', 'student')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(user.uid, body);
  }

  @Put(':uid')
  @ApiOperation({ summary: 'Actualizar usuario por UID (admin)' })
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('uid') uid: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(uid, body);
  }

  @Patch('photo')
  @ApiOperation({ summary: 'Actualizar foto del usuario actual' })
  @Roles('student')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUserPhoto(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateUserPhotoDto,
  ) {
    return this.userService.updateUserPhoto(user.uid, body);
  }

  @Patch(':uid/photo')
  @ApiOperation({ summary: 'Actualizar foto de usuario por UID (admin)' })
  @Roles('student')
  @HttpCode(HttpStatus.OK)
  async updateUserPhoto(
    @Param('uid') uid: string,
    @Body() body: UpdateUserPhotoDto,
  ) {
    return this.userService.updateUserPhoto(uid, body);
  }

  @Patch('desactivate')
  @ApiOperation({ summary: 'Desactivar usuario actual' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deactivateCurrentUser(@CurrentUser() user: JwtPayload) {
    return this.userService.deactivateUser(user.uid);
  }

  @Patch(':uid/desactivate')
  @ApiOperation({ summary: 'Desactivar usuario por UID (admin)' })
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(@Param('uid') uid: string) {
    return this.userService.deactivateUser(uid);
  }

  @Patch(':uid/reactivate')
  @ApiOperation({ summary: 'Reactivar usuario (admin)' })
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async reactivateUser(@Param('uid') uid: string) {
    return this.userService.reactivateUser(uid);
  }
}
