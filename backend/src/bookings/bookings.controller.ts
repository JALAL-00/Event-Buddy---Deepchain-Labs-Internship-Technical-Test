import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Delete,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DeleteBookingDto } from './dto/delete-booking.dto';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookingDto: CreateBookingDto, @GetCurrentUser() currentUser: User) {
    return this.bookingsService.create(createBookingDto, currentUser);
  }

  @Get('my-bookings')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  findMyBookings(@GetCurrentUser() currentUser: User) {
    return this.bookingsService.findMyBookings(currentUser);
  }

  @Delete('cancel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(@Body() deleteBookingDto: DeleteBookingDto, @GetCurrentUser() currentUser: User) {
    return this.bookingsService.cancelBooking(deleteBookingDto.bookingId, currentUser);
  }
}
