import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { PhotosModule } from 'src/modules/photos/Photos.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    PhotosModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('config.jwtSecret'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
