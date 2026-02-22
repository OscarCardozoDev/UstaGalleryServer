import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StylesService } from './Styles.service';
import { Style, UpdateStyleDto } from './Styles.interface';
import { AuthGuard } from 'src/middleware/jwt.guard';

@Controller('styles')
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllStyles() {
    return this.stylesService.getAll();
  }

  @Get('all/:groupId')
  @HttpCode(HttpStatus.OK)
  async getAllByGroup(@Param('groupId') groupId: string) {
    return this.stylesService.getAllByGroup(groupId);
  }

  @Get('get/:uid')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('uid') uid: string) {
    return this.stylesService.get(uid);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createStyle(@Body() body: Style) {
    return this.stylesService.create(body);
  }

  @UseGuards(AuthGuard)
  @Put('update/:uid')
  @HttpCode(HttpStatus.OK)
  async updateStyle(@Param('uid') uid: string, @Body() body: UpdateStyleDto) {
    return this.stylesService.update(uid, body);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:uid')
  @HttpCode(HttpStatus.OK)
  async deleteStyle(@Param('uid') uid: string) {
    return this.stylesService.delete(uid);
  }
}
