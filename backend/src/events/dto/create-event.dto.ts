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
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  image?: any;
}