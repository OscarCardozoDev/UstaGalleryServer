import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClassesController } from './Classes.controller';
import { ClassesService } from './Classes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('config.jwtSecret'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
