import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { photoManagment } from 'src/utils/photosManagment';
import { v4 as uuidv4 } from 'uuid';

import {
  CreatePhotoUseCase,
  UpdatePhotoUseCase,
  PhotoResponse,
} from './Photos.interface';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  // ───────────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────────

  private base64ToBuffer(base64: string): {
    buffer: Buffer;
    extension: string;
  } {
    const match = base64.match(/^data:image\/(\w+);base64,(.+)$/);

    if (!match) {
      throw new BadRequestException('Invalid base64 image format');
    }

    const [, extension, data] = match;

    return {
      buffer: Buffer.from(data, 'base64'),
      extension,
    };
  }

  // ───────────────────────────────────────────────────────────────
  // CREATE
  // ───────────────────────────────────────────────────────────────

  async createPhotoUseCase(params: CreatePhotoUseCase): Promise<PhotoResponse> {
    const { base64, name, folder } = params;

    const { buffer, extension } = this.base64ToBuffer(base64);

    const fileName = name.includes('.') ? name : `${uuidv4()}.${extension}`;

    const fileResult = await photoManagment.save({
      fileBuffer: buffer,
      fileName,
      folderPath: folder,
    });

    const photo = await this.prisma.photos.create({
      data: {
        name: fileName,
        url: fileResult.url,
      },
    });

    return {
      uid: photo.uid,
      name: photo.name,
      url: photo.url,
    };
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

    return {
      uid: photo.uid,
      name: photo.name,
      url: photo.url,
    };
  }

  // ───────────────────────────────────────────────────────────────
  // UPDATE
  // ───────────────────────────────────────────────────────────────

  async updatePhotoUseCase(
    photoId: string,
    params: UpdatePhotoUseCase,
  ): Promise<PhotoResponse> {
    const photo = await this.prisma.photos.findUnique({
      where: { uid: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const { buffer } = this.base64ToBuffer(params.base64);

    await photoManagment.edit({
      fileBuffer: buffer,
      folderPath: photo.url,
    });

    return {
      uid: photo.uid,
      name: photo.name,
      url: photo.url,
    };
  }

  // ───────────────────────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────────────────────

  async deletePhotoUseCase(photoId: string): Promise<void> {
    const photo = await this.prisma.photos.findUnique({
      where: { uid: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const [, , ...parts] = photo.url!.split('/');
    const fileName = parts.pop()!;
    const folderPath = parts.join('/');

    await photoManagment.remove(fileName, folderPath);

    await this.prisma.photos.delete({
      where: { uid: photoId },
    });
  }
}
