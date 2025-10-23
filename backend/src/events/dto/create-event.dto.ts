// backend/src/events/dto/create-event.dto.ts

import { Type, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  // This @Transform decorator will be kept as a best-effort for non-form-data requests
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  // We remove @IsArray and @IsString({ each: true }) to allow the service to handle the type logic robustly.
  // The type is now explicitly allowed to be a string or string array.
  tags?: string | string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  image?: any;
}