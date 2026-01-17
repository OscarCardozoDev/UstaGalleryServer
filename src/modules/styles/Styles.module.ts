import { Module } from '@nestjs/common';
import { StylesService } from './Styles.service';
import { StylesController } from './Styles.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [StylesController],
  providers: [StylesService, PrismaService],
})
export class StylesModule {}
