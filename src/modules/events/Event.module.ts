import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventController } from './Event.controller';
import { EventService } from './Event.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PhotosModule } from 'src/modules/photos/Photos.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    PhotosModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('config.jwtSecret'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
