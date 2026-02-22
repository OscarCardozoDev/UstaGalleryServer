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
import { CurrentUser } from 'src/decorators/currentUser';
import { UserService } from './user.service';
import { CreateUserUseCase, UpdateUserDto } from './user.interface';
import { JwtPayload } from 'src/interface/jwtPayload';
import { AuthGuard } from 'src/middleware/jwt.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Crear usuario con foto opcional
   */
  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() body: CreateUserUseCase,
    @CurrentUser('uid') uid: string,
  ) {
    return this.userService.createUserUseCase({
      ...body,
      uid: uid,
    });
  }

  /**
   * Obtener todos los usuarios activos
   */
  @Get('allActive')
  @HttpCode(HttpStatus.OK)
  async getActiveUsers() {
    return this.userService.getActiveUsers();
  }

  /**
   * Obtener usuario actual (del token JWT)
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@CurrentUser() user: JwtPayload) {
    return this.userService.getUser(user.uid);
  }

  /**
   * Obtener usuario por UID
   */
  @Get(':uid')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('uid') uid: string) {
    return this.userService.getUser(uid);
  }

  /**
   * Actualizar datos del usuario actual
   */
  @Put('update')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(user.uid, body);
  }

  /**
   * Actualizar datos de un usuario específico (admin)
   */
  @Put(':uid')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('uid') uid: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(uid, body);
  }

  /**
   * Actualizar foto del usuario actual
   */
  @Patch('photo')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUserPhoto(
    @CurrentUser() user: JwtPayload,
    @Body() body: { base64: string; name: string; folder: string },
  ) {
    return this.userService.updateUserPhoto(user.uid, body);
  }

  /**
   * Actualizar foto de un usuario específico (admin)
   */
  @Patch(':uid/photo')
  @HttpCode(HttpStatus.OK)
  async updateUserPhoto(
    @Param('uid') uid: string,
    @Body() body: { base64: string; name: string; folder: string },
  ) {
    return this.userService.updateUserPhoto(uid, body);
  }

  /**
   * Desactivar usuario actual (soft delete)
   */
  @Patch('desactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateCurrentUser(@CurrentUser() user: JwtPayload) {
    return this.userService.deactivateUser(user.uid);
  }

  /**
   * Desactivar usuario específico (admin)
   */
  @Patch(':uid/desactivate')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(@Param('uid') uid: string) {
    return this.userService.deactivateUser(uid);
  }

  /**
   * Reactivar usuario
   */
  @Patch(':uid/reactivate')
  @HttpCode(HttpStatus.OK)
  async reactivateUser(@Param('uid') uid: string) {
    return this.userService.reactivateUser(uid);
  }
}
