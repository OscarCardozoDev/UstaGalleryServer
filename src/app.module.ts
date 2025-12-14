import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurationApp from 'config/configuration-app';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      load: [configurationApp],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
