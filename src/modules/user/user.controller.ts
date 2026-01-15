import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/currentUser';
import { UserService } from './user.service';
import { User, UpdateUserDto } from './user.interface';
import { JwtPayload } from 'src/interface/jwtPayload';
import { AuthGuard } from 'src/middleware/jwt.guard';

@UseGuards(AuthGuard)
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

  @Get('read')
  async getUser(@CurrentUser() user: JwtPayload) {
    return this.userService.getUser(user.uid);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(user.uid, body);
  }
}
