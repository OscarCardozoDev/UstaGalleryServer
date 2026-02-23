import { Body, Controller, Param, Get, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PhotosService } from './Photos.service';
import { CreatePhotoDto, UpdatePhotoDto, PhotoParamsDto } from './Photos.dto';

@ApiTags('photos')
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get('get/:uid')
  @ApiOperation({ summary: 'Obtener foto por UID' })
  async getPhoto(@Param() params: PhotoParamsDto) {
    return this.photosService.getPhotoUseCase(params.uid);
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear foto' })
  async createPhoto(@Body() body: CreatePhotoDto) {
    return this.photosService.createPhotoUseCase(body);
  }

  @Put('edit/:uid')
  @ApiOperation({ summary: 'Actualizar foto' })
  async updatePhoto(
    @Param() params: PhotoParamsDto,
    @Body() body: UpdatePhotoDto,
  ) {
    return this.photosService.updatePhotoUseCase(params.uid, body);
  }
}
