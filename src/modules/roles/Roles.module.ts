import { Module } from '@nestjs/common';
import { RolesController } from './Roles.controller';
import { RolesService } from './Roles.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
