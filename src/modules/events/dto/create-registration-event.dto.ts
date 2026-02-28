import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRegistrationEventDto {
  @IsInt()
  @Type(() => Number)
  event_category_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone: string;

  @IsDateString()
  @IsOptional()
  expired_at?: string;

  @IsString()
  @IsOptional()
  time_reregistration?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}
