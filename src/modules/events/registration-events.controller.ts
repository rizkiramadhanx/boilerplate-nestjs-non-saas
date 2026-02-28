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
import { RegistrationEventsService } from './registration-events.service';
import { CreateRegistrationEventDto } from './dto/create-registration-event.dto';
import { UpdateRegistrationEventDto } from './dto/update-registration-event.dto';
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

@Controller('registration-event')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RegistrationEventsController {
  constructor(
    private readonly registrationEventsService: RegistrationEventsService,
    private readonly logsService: LogsService,
  ) {}

  @Permissions('registration_event:create')
  @Post()
  async create(
    @Body() dto: CreateRegistrationEventDto,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const registration = await this.registrationEventsService.create(dto);
      await this.logsService.createLog({
        action: 'registration_event:create',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.CREATED,
      });
      res.status(HttpStatus.CREATED);
      return createSuccessResponse(
        'Registration event created successfully',
        registration,
      );
    } catch (err) {
      console.error('Failed create registration event', err);
      await this.logsService.createLog({
        action: 'registration_event:create',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.CONFLICT,
      });
      res.status(HttpStatus.CONFLICT);
      return createErrorResponse(
        'Failed to create registration event',
        HttpStatus.CONFLICT,
      );
    }
  }

  @Permissions('registration_event:read')
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('event_category_id') eventCategoryId: string | undefined,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const eventCategoryIdNum = eventCategoryId
        ? parseInt(eventCategoryId, 10)
        : undefined;
      const result = await this.registrationEventsService.findAll(
        paginationDto,
        eventCategoryIdNum,
      );
      await this.logsService.createLog({
        action: 'registration_event:read',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Get all registration events success',
        result.data,
        result.meta,
      );
    } catch (err) {
      console.error('Failed get registration events', err);
      await this.logsService.createLog({
        action: 'registration_event:read',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return createErrorResponse(
        'Failed to get registration events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Permissions('registration_event:read')
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const registration = await this.registrationEventsService.findOne(id);
      await this.logsService.createLog({
        action: 'registration_event:read',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Get registration event success',
        registration,
      );
    } catch (err) {
      console.error('Failed get registration event by id', err);
      await this.logsService.createLog({
        action: 'registration_event:read',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse(
        'Registration event not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Permissions('registration_event:update')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegistrationEventDto,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const registration = await this.registrationEventsService.update(
        id,
        dto,
      );
      await this.logsService.createLog({
        action: 'registration_event:update',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Registration event updated successfully',
        registration,
      );
    } catch (err) {
      console.error('Failed update registration event', err);
      await this.logsService.createLog({
        action: 'registration_event:update',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse(
        'Failed to update registration event',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Permissions('registration_event:delete')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: CurrentUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.registrationEventsService.remove(id);
      await this.logsService.createLog({
        action: 'registration_event:delete',
        userId: currentUser.id,
        status: 'SUCCESS',
        statusCode: HttpStatus.OK,
      });
      res.status(HttpStatus.OK);
      return createSuccessResponse(
        'Registration event deleted successfully',
        result,
      );
    } catch (err) {
      console.error('Failed delete registration event', err);
      await this.logsService.createLog({
        action: 'registration_event:delete',
        userId: currentUser?.id,
        status: 'ERROR',
        statusCode: HttpStatus.NOT_FOUND,
      });
      res.status(HttpStatus.NOT_FOUND);
      return createErrorResponse(
        'Failed to delete registration event',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
