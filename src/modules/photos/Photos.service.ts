import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotoPayload, PhotoResponse, PhotoParams } from './Photos.interface';

@Injectable()
export class PhotosService {
  constructor(private prismaService: PrismaService) {}

  async setPhoto(data: PhotoPayload): Promise<PhotoParams> {
    try {
      return await this.prismaService.photos.create({
        data,
        select: {
          uid: true,
        },
      });
    } catch {
      throw new InternalServerErrorException('Error creating photo');
    }
  }

  async putPhoto(photoId: string, data: PhotoPayload): Promise<PhotoResponse> {
    try {
      return await this.prismaService.photos.update({
        where: { uid: photoId },
        data,
        select: {
          uid: true,
          name: true,
          url: true,
        },
      });
    } catch {
      throw new NotFoundException('Photo not found');
    }
  }

  async getPhoto(photoId: string): Promise<PhotoResponse> {
    try {
      const photo = await this.prismaService.photos.findUnique({
        where: { uid: photoId },
        select: {
          uid: true,
          name: true,
          url: true,
        },
      });

      if (!photo) {
        throw new NotFoundException('Photo not found');
      }

      return photo;
    } catch {
      throw new InternalServerErrorException('Error fetching photo');
    }
  }
}
