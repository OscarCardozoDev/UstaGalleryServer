import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { photoManagment } from 'src/utils/photosManagment';
import { CreatePhotoUseCase, UpdatePhotoUseCase } from './Photos.interface';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  /* =========================
   * CREATE
   * ========================= */
  async createPhotoUseCase(data: CreatePhotoUseCase) {
    const { base64, name, folder } = data;

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64, 'base64');
    } catch {
      throw new BadRequestException('Invalid base64 image');
    }

    // 1️⃣ Guardar archivo
    const fileResult = await photoManagment.save({
      fileBuffer: buffer,
      fileName: name,
      folderPath: folder,
    });

    // 2️⃣ Guardar metadata
    const photo = await this.prisma.photos.create({
      data: {
        name,
        url: fileResult.url,
      },
      select: { uid: true, name: true, url: true },
    });

    return photo;
  }

  /* =========================
   * GET
   * ========================= */
  async getPhotoUseCase(uid: string) {
    const photo = await this.prisma.photos.findUnique({
      where: { uid },
    });

    if (!photo || !photo.url) {
      throw new NotFoundException('Photo not found');
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
   * UPDATE
   * ========================= */
  async updatePhotoUseCase(uid: string, data: UpdatePhotoUseCase) {
    const { base64 } = data;

    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64, 'base64');
    } catch {
      throw new BadRequestException('Invalid base64 image');
    }

    const photo = await this.prisma.photos.findUnique({
      where: { uid },
    });

    if (!photo || !photo.url) {
      throw new NotFoundException('Photo not found');
    }

    // Reemplazar archivo
    await photoManagment.edit({
      fileBuffer: buffer,
      folderPath: photo.url,
    });

    return {
      uid,
      name: photo.name,
      url: photo.url,
    };
  }
}
