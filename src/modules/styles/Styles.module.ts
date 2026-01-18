import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StylesService } from './Styles.service';
import { StylesController } from './Styles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('config.jwtSecret'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [StylesController],
  providers: [StylesService],
})
export class StylesModule {}
