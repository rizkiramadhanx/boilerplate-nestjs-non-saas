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
import { EventCategoriesService } from './event-categories.service';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';
import { UpdateEventCategoryDto } from './dto/update-event-category.dto';
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

@Controller('event-category')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EventCategoriesController {
  constructor(
    private readonly eventCategoriesService: EventCategoriesService,
    private readonly logsService: LogsService,
  ) {}

  @Permissions('event_category:create')
  @Post()
  async create(
    @Body() dto: CreateEventCategoryDto,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const category = await this.eventCategoriesService.create(dto);
      await this.logsService.createLog({
        action: 'event_category:create',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.CREATED,
      });
      res.status(HttpStatus.CREATED);
      return createSuccessResponse(
        'Event category created successfully',
        category,
      );
    } catch (err) {
      console.error('Failed create event category', err);
      await this.logsService.createLog({
        action: 'event_category:create',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.CONFLICT,
      });
      res.status(HttpStatus.CONFLICT);
      return createErrorResponse(
        'Failed to create event category',
        HttpStatus.CONFLICT,
      );
    }
  }

  @Permissions('event_category:read')
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('event_id') eventId: string | undefined,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const eventIdNum = eventId ? parseInt(eventId, 10) : undefined;
      const result = await this.eventCategoriesService.findAll(
        paginationDto,
        eventIdNum,
      );
      await this.logsService.createLog({
        action: 'event_category:read',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Get all event categories success',
        result.data,
        result.meta,
      );
    } catch (err) {
      console.error('Failed get event categories', err);
      await this.logsService.createLog({
        action: 'event_category:read',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return createErrorResponse(
        'Failed to get event categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Permissions('event_category:read')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const category = await this.eventCategoriesService.findOne(id);
      await this.logsService.createLog({
        action: 'event_category:read',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse('Get event category success', category);
    } catch (err) {
      console.error('Failed get event category by id', err);
      await this.logsService.createLog({
        action: 'event_category:read',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse(
        'Event category not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Permissions('event_category:update')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventCategoryDto,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const category = await this.eventCategoriesService.update(id, dto);
      await this.logsService.createLog({
        action: 'event_category:update',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Event category updated successfully',
        category,
      );
    } catch (err) {
      console.error('Failed update event category', err);
      await this.logsService.createLog({
        action: 'event_category:update',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse(
        'Failed to update event category',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Permissions('event_category:delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.eventCategoriesService.remove(id);
      await this.logsService.createLog({
        action: 'event_category:delete',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Event category deleted successfully',
        result,
      );
    } catch (err) {
      console.error('Failed delete event category', err);
      await this.logsService.createLog({
        action: 'event_category:delete',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse(
        'Failed to delete event category',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
