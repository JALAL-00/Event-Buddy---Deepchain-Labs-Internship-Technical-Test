import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

// PartialType makes all fields of CreateEventDto optional.
// This is perfect for PATCH requests.
export class UpdateEventDto extends PartialType(CreateEventDto) {}