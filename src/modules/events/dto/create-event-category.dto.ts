import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventCategoryDto {
  @IsInt()
  @Type(() => Number)
  event_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  max_participant?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
