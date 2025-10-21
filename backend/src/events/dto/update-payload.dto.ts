import { IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UpdateEventDto } from './update-event.dto';

export class UpdatePayloadDto {
  @IsUUID()
  id: string;

  // This tells the validator to also validate the 'data' object
  // against the rules in UpdateEventDto
  @ValidateNested()
  @Type(() => UpdateEventDto)
  data: UpdateEventDto;
}