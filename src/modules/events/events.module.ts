import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { EventCategoryEntity } from './entities/event-category.entity';
import { ParticipantEntity } from './entities/participant.entity';
import { RegistrationEventEntity } from './entities/registration-event.entity';
import { HistoryRegistrationEntity } from './entities/history-registration.entity';
import { EventsService } from './events.service';
import { EventCategoriesService } from './event-categories.service';
import { RegistrationEventsService } from './registration-events.service';
import { EventsController } from './events.controller';
import { EventCategoriesController } from './event-categories.controller';
import { RegistrationEventsController } from './registration-events.controller';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity,
      EventCategoryEntity,
      ParticipantEntity,
      RegistrationEventEntity,
      HistoryRegistrationEntity,
    ]),
    LogsModule,
  ],
  controllers: [
    EventsController,
    EventCategoriesController,
    RegistrationEventsController,
  ],
  providers: [EventsService, EventCategoriesService, RegistrationEventsService],
  exports: [
    TypeOrmModule,
    EventsService,
    EventCategoriesService,
    RegistrationEventsService,
  ],
})
export class EventsModule {}
