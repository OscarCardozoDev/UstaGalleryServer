import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { photoManagment } from 'src/utils/photosManagment';
import { PhotosService } from './Photos.service';
import {
  CreatePhotoDto,
  UpdatePhotoDto,
  PhotoParams,
  PhotoResponse,
  GetPhotoResponse,
} from './Photos.interface';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  // =========================
  // CREATE
  // =========================
  @Post()
  async createPhoto(@Body() body: CreatePhotoDto): Promise<PhotoResponse> {
    const { base64, name, folder } = body;

    if (!base64 || !name || !folder) {
      throw new BadRequestException('base64, name and folder are required');
    }

    let buffer: Buffer;

    try {
      buffer = Buffer.from(base64, 'base64');
    } catch {
      throw new BadRequestException('Invalid base64 image');
    }

    // 1️⃣ Guardar archivo en filesystem
    const fileResult = await photoManagment.save({
      fileBuffer: buffer,
      fileName: name,
      folderPath: folder,
    });

    // 2️⃣ Guardar metadata en DB
    const photo = await this.photosService.setPhoto({
      name,
      url: fileResult.url,
    });

    // 3️⃣ Devolver uid
    return {
      uid: photo.uid,
    };
  }

  // =========================
  // UPDATE
  // =========================
  @Put(':uid')
  async updatePhoto(
    @Param() params: PhotoParams,
    @Body() body: UpdatePhotoDto,
  ): Promise<PhotoResponse> {
    const { uid } = params;
    const { base64, name, folder } = body;

    if (!base64 || !name || !folder) {
      throw new BadRequestException('base64, name and folder are required');
    }

    const buffer = Buffer.from(base64, 'base64');

    // Verificar existencia en DB
    const existing = await this.photosService.getPhoto(uid);
    if (!existing) {
      throw new NotFoundException('Photo not found');
    }

    // Reemplazar archivo
    const file = await photoManagment.edit({
      fileBuffer: buffer,
      fileName: name,
      folderPath: folder,
    });

    await this.photosService.putPhoto(uid, {
      name,
      url: file.url,
    });

    return {
      uid,
    };
  }

  // =========================
  // GET
  // =========================
  @Get(':uid')
  async getPhoto(@Param() params: PhotoParams): Promise<GetPhotoResponse> {
    const photo = await this.photosService.getPhoto(params.uid);

    if (!photo) {
      throw new NotFoundException('Photo not found');
    } else if (!photo.name || !photo.url) {
      throw new NotFoundException('Photo name or url not found, check DB');
    }

    const fileResult = await photoManagment.get(photo.url);

    if (!fileResult) {
      throw new NotFoundException('Image file not found');
    }

    return {
      uid: photo.uid,
      name: photo.name,
      base64: fileResult.base64,
    };
  }

  /* =========================
  DELETE
  @Delete(':uid')
  async deletePhoto(@Param() params: PhotoParams): Promise<void> {
    const photo = await this.photosService.getPhoto(params.uid);

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // Eliminar archivo físico
    const fileName = photo.url.split('/').pop();
    const folderPath = photo.url
      .replace(`/${fileName}`, '')
      .replace(/^Images\//, '');

    await photoManagment.remove(fileName!, folderPath);

    // Eliminar registro DB
    await this.photosService.deletePhoto(params.uid);
  }
  ========================= */
}
