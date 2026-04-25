import { Controller, Get, Post, Put, Delete, UseGuards, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScheduleService } from './Schedule.service';
import { AuthGuard } from 'src/middleware/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleParamsDto, GroupParamDto } from './Schedule.dto';

@ApiTags('schedule')
@UseGuards(AuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create')
  @Roles('professor', 'admin')
  @ApiOperation({ summary: 'Crear horario y generar sesiones del semestre' })
  async create(@Body() body: CreateScheduleDto) {
    return this.scheduleService.create(body);
  }

  @Get('group/:groupId')
  @Roles('professor', 'admin', 'student')
  @ApiOperation({ summary: 'Obtener horarios activos del grupo' })
  async getByGroup(@Param() params: GroupParamDto) {
    return this.scheduleService.getByGroup(params.groupId);
  }

  @Put(':uid')
  @Roles('professor', 'admin')
  @ApiOperation({ summary: 'Actualizar horario y regenerar sesiones futuras' })
  async update(@Param() params: ScheduleParamsDto, @Body() body: UpdateScheduleDto) {
    return this.scheduleService.update({ scheduleId: params.uid, data: body });
  }

  @Delete(':uid')
  @Roles('professor', 'admin')
  @ApiOperation({ summary: 'Desactivar horario y eliminar sesiones futuras sin asistencia' })
  async remove(@Param() params: ScheduleParamsDto) {
    return this.scheduleService.remove(params.uid);
  }
}
