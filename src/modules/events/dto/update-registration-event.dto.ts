import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationEventDto } from './create-registration-event.dto';

export class UpdateRegistrationEventDto extends PartialType(
  CreateRegistrationEventDto,
) {}
