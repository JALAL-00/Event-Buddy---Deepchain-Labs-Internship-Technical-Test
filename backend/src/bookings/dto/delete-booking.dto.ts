import { IsUUID } from 'class-validator';

export class DeleteBookingDto {
  @IsUUID()
  bookingId: string;
}