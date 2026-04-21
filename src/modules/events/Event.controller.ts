import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/middleware/jwt.guard';
import { EventService } from './Event.service';
import {
  CreateEventDto,
  UpdateEventDto,
  UpdateEventStatusDto,
  UpdateEventProductsDto,
  AddEventPhotoDto,
  SendInvitationDto,
  RespondInvitationDto,
  GetEventsDto,
  EventParamsDto,
  EventPhotoParamsDto,
  EventGroupParamsDto,
  InvitationParamsDto,
} from './Event.dto';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // ─── CREATE ───────────────────────────────────────────────────────────────

  @Post('create')
  @ApiOperation({ summary: 'Crear un evento' })
  @UseGuards(AuthGuard)
  @Roles('professor', 'admin')
  async create(@Body() body: CreateEventDto) {
    return this.eventService.createEventUseCase({
      event: {
        name: body.name,
        description: body.description,
        eventType: body.eventType,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        locationUrl: body.locationUrl,
        isVirtual: body.isVirtual,
        streamingUrl: body.streamingUrl,
        createdById: body.createdById,
      },
      groupIds: body.groupIds,
      productIds: body.productIds,
      coverPhoto: body.coverPhoto,
    });
  }

  // ─── READ ─────────────────────────────────────────────────────────────────

  @Get('getAll')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los eventos paginados (admin)' })
  @Roles('admin')
  async getAll(@Query() query: GetEventsDto) {
    return this.eventService.getAll(query);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Obtener eventos próximos aprobados (público)' })
  async getUpcoming(@Query() query: GetEventsDto) {
    return this.eventService.getUpcoming(query);
  }

  @Get('past')
  @ApiOperation({ summary: 'Obtener eventos pasados completados (público)' })
  async getPast(@Query() query: GetEventsDto) {
    return this.eventService.getPast(query);
  }

  @Get('home')
  @ApiOperation({
    summary: 'Obtener eventos próximos para la página de inicio (público)',
  })
  async getHome(@Query() query: GetEventsDto) {
    return this.eventService.getHome(query);
  }

  @Get('getByGroup/:uid')
  @ApiOperation({ summary: 'Obtener eventos de un grupo específico (público)' })
  async getByGroup(
    @Param('uid', new ParseUUIDPipe()) groupId: string,
    @Query() query: GetEventsDto,
  ) {
    return this.eventService.getByGroup(groupId, query);
  }

  @Get('available-products/:groupId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtener obras APPROVED del grupo disponibles para un evento',
  })
  @Roles('professor', 'admin')
  async getAvailableProducts(
    @Param('groupId', new ParseUUIDPipe()) groupId: string,
  ) {
    return this.eventService.getAvailableProducts(groupId);
  }

  @Get('invitations/pending')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Ver invitaciones pendientes del profesor autenticado',
  })
  @Roles('professor', 'admin')
  async getPendingInvitations(@Query('profesorId') profesorId: string) {
    return this.eventService.getPendingInvitations(profesorId);
  }

  @Get('get/:uid')
  @ApiOperation({ summary: 'Obtener detalle completo de un evento (público)' })
  async getById(@Param() params: EventParamsDto) {
    return this.eventService.getById(params.uid);
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────

  @Put('update/:uid')
  @ApiOperation({
    summary: 'Editar info general del evento (vuelve a PENDING)',
  })
  @UseGuards(AuthGuard)
  @Roles('professor', 'admin')
  async update(@Param() params: EventParamsDto, @Body() body: UpdateEventDto) {
    return this.eventService.updateEventUseCase({
      eventId: params.uid,
      data: {
        name: body.name,
        description: body.description,
        eventType: body.eventType,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        locationUrl: body.locationUrl,
        isVirtual: body.isVirtual,
        streamingUrl: body.streamingUrl,
      },
    });
  }

  @Patch('status/:uid')
  @ApiOperation({ summary: 'Cambiar el status de un evento (admin)' })
  @UseGuards(AuthGuard)
  @Roles('admin')
  async updateStatus(
    @Param('uid', new ParseUUIDPipe()) uid: string,
    @Body() dto: UpdateEventStatusDto,
  ) {
    return this.eventService.updateStatus({
      uid,
      status: dto.status,
      feedback: dto.feedback,
    });
  }

  @Patch('deactivate/:uid')
  @ApiOperation({ summary: 'Desactivar un evento (soft delete, admin)' })
  @UseGuards(AuthGuard)
  @Roles('admin')
  async deactivate(@Param('uid', new ParseUUIDPipe()) uid: string) {
    return this.eventService.deactivate(uid);
  }

  // ─── PRODUCTS DEL EVENTO ──────────────────────────────────────────────────

  @Put(':uid/products')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Actualizar obras del grupo en el evento (vuelve a PENDING)',
  })
  @Roles('professor', 'admin')
  async updateProducts(
    @Param() params: EventParamsDto,
    @Body() body: UpdateEventProductsDto,
  ) {
    return this.eventService.updateEventProducts({
      eventId: params.uid,
      productIds: body.productIds,
      requestingGroupId: body.groupId,
    });
  }

  // ─── FOTOS DEL EVENTO ─────────────────────────────────────────────────────

  @Post(':uid/photos')
  @ApiOperation({
    summary:
      'Agregar foto al evento (HERO/PROMO: coordinador/admin · MEMORY: participante)',
  })
  @Roles('professor', 'admin')
  async addPhoto(
    @Param() params: EventParamsDto,
    @Body() body: AddEventPhotoDto,
  ) {
    return this.eventService.addPhoto({
      eventId: params.uid,
      images: body.images,
    });
  }

  @Delete(':uid/photos/:photoId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar una foto del evento' })
  @Roles('professor', 'admin')
  async removePhoto(@Param() params: EventPhotoParamsDto) {
    return this.eventService.removePhoto(params.uid, params.photoId);
  }

  // ─── INVITACIONES ─────────────────────────────────────────────────────────

  @Post(':uid/invite')
  @ApiOperation({ summary: 'Enviar invitación a un grupo (coordinador/admin)' })
  @Roles('professor', 'admin')
  @UseGuards(AuthGuard)
  async sendInvitation(
    @Param() params: EventParamsDto,
    @Body() body: SendInvitationDto,
  ) {
    return this.eventService.sendInvitation(params.uid, body.groupId);
  }

  @Patch('invitations/:uid/respond')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Aceptar o rechazar una invitación (profesor invitado)',
  })
  @Roles('professor')
  async respondInvitation(
    @Param() params: InvitationParamsDto,
    @Body() dto: RespondInvitationDto,
  ) {
    return this.eventService.respondInvitation({
      invitationId: params.uid,
      status: dto.status,
    });
  }

  @Delete(':uid/invite/:groupId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Revocar invitación de un grupo (coordinador/admin)',
  })
  @Roles('professor', 'admin')
  async revokeInvitation(@Param() params: EventGroupParamsDto) {
    return this.eventService.revokeInvitation(params.uid, params.groupId);
  }
}
