import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { PhotosModule } from 'src/modules/photos/Photos.module';
import { ConfigModule } from '@nestjs/config';
import configurationApp from 'config/configuration-app';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      load: [configurationApp],
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PhotosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
