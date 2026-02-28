import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  createSuccessResponse,
  createErrorResponse,
} from '../../common/type/response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser, CurrentUserType } from '../../security/user.decorator';
import { LogsService } from '../logs/logs.service';

@Controller('event')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logsService: LogsService,
  ) {}

  @Permissions('event:create')
  @Post()
  async create(
    @Body() dto: CreateEventDto,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const event = await this.eventsService.create(dto);
      await this.logsService.createLog({
        action: 'event:create',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.CREATED,
      });
      res.status(HttpStatus.CREATED);
      return createSuccessResponse('Event created successfully', event);
    } catch (err) {
      console.error('Failed create event', err);
      await this.logsService.createLog({
        action: 'event:create',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.CONFLICT,
      });
      res.status(HttpStatus.CONFLICT);
      return createErrorResponse('Failed to create event', HttpStatus.CONFLICT);
    }
  }

  @Permissions('event:read')
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.eventsService.findAll(paginationDto);
      await this.logsService.createLog({
        action: 'event:read',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Get all events success',
        result.data,
        result.meta,
      );
    } catch (err) {
      console.error('Failed get events', err);
      await this.logsService.createLog({
        action: 'event:read',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return createErrorResponse(
        'Failed to get events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Permissions('event:read')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const event = await this.eventsService.findOne(id);
      await this.logsService.createLog({
        action: 'event:read',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse('Get event success', event);
    } catch (err) {
      console.error('Failed get event by id', err);
      await this.logsService.createLog({
        action: 'event:read',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse('Event not found', HttpStatus.NOT_FOUND);
    }
  }

  @Permissions('event:update')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const event = await this.eventsService.update(id, dto);
      await this.logsService.createLog({
        action: 'event:update',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse('Event updated successfully', event);
    } catch (err) {
      console.error('Failed update event', err);
      await this.logsService.createLog({
        action: 'event:update',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse('Failed to update event', HttpStatus.NOT_FOUND);
    }
  }

  @Permissions('event:delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.eventsService.remove(id);
      await this.logsService.createLog({
        action: 'event:delete',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse('Event deleted successfully', result);
    } catch (err) {
      console.error('Failed delete event', err);
      await this.logsService.createLog({
        action: 'event:delete',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse('Failed to delete event', HttpStatus.NOT_FOUND);
    }
  }
}
