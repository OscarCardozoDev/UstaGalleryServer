import { Module } from '@nestjs/common';
import { PhotosController } from './Photos.controller';
import { PhotosService } from './Photos.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
