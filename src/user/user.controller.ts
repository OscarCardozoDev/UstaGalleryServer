import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UpdateUserDto } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: User) {
    return this.userService.setUserData(body);
  }

  @Get('allActive')
  @HttpCode(HttpStatus.OK)
  async getActiveUsers() {
    return this.userService.getActiveUsers();
  }

  @Get('read/:uid')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('uid') uid: string) {
    return this.userService.getUser(uid);
  }

  @Put('update/:uid')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('uid') uid: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(uid, body);
  }
}
