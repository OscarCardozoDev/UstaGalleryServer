import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PhotosService } from './Photos.service';
import {
  CreatePhotoUseCase,
  PhotoParams,
  UpdatePhotoUseCase,
} from './Photos.interface';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  // =========================
  // CREATE
  // =========================
  @Post('create')
  async createPhoto(@Body() body: CreatePhotoUseCase) {
    return this.photosService.createPhotoUseCase(body);
  }

  // =========================
  // GET
  // =========================
  @Get('get/:uid')
  async getPhoto(@Param() params: PhotoParams) {
    return this.photosService.getPhotoUseCase(params.uid);
  }

  // =========================
  // UPDATE
  // =========================
  @Put('edit/:uid')
  async updatePhoto(
    @Param() params: PhotoParams,
    @Body() body: UpdatePhotoUseCase,
  ) {
    return this.photosService.updatePhotoUseCase(params.uid, body);
  }
}
