import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GroupController } from './Group.controller';
import { GroupService } from './Group.service';
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
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
