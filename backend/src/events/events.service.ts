import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventRepository
      .createQueryBuilder('event')
      .addSelect((subQuery) => {
        return subQuery
          .select('COALESCE(SUM(booking.numberOfSeats), 0)', 'bookedSeats')
          .from(Booking, 'booking')
          .where('booking.eventId = event.id');
      }, 'bookedSeats');
  }
  
  private mapEventResponse(event: any): any {
    const bookedSeats = parseInt(event.bookedSeats, 10) || 0;
    const { bookings, ...restOfEvent } = event;
    return {
      ...restOfEvent,
      bookedSeats,
      spotsLeft: event.capacity - bookedSeats,
    };
  }

  private combineDateAndTime(date: string, time: string): Date {
    const startTime = time.split('-')[0].trim();
    const [timePart, modifier] = startTime.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const eventDate = new Date(date);
    eventDate.setHours(hours, minutes, 0, 0);

    return eventDate;
  }
  
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { date, time, ...restDto } = createEventDto;
    
    if (!date || !time) {
      throw new BadRequestException("Date and time are required.");
    }

    const eventDate = this.combineDateAndTime(date, time);

    const newEvent = this.eventRepository.create({
      ...restDto,
      date: eventDate,
    });
    return this.eventRepository.save(newEvent);
  }
  
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    // We fetch the event first to ensure it exists.
    const event = await this.eventRepository.findOneBy({id});
    if (!event) {
        throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    // Update fields from the DTO. `preload` can be less predictable with relations.
    Object.assign(event, updateEventDto);
    
    // Handle date/time update if both are provided
    if (updateEventDto.date && updateEventDto.time) {
      event.date = this.combineDateAndTime(updateEventDto.date, updateEventDto.time);
    }
    
    return this.eventRepository.save(event);
  }

  // --- PAGINATED METHODS WITH FIXES ---
  async findUpcoming(paginationDto: PaginationDto) {
    // FIX: Provide default values here to satisfy TypeScript
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 6;
    const skip = (page - 1) * limit;

    const [events, total] = await this.getEventsBaseQuery()
      .where('event.date > :now', { now: new Date() })
      .orderBy('event.date', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: events.map(event => this.mapEventResponse(event)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPast(paginationDto: PaginationDto) {
    // FIX: Provide default values here to satisfy TypeScript
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 6;
    const skip = (page - 1) * limit;

    const [events, total] = await this.getEventsBaseQuery()
      .where('event.date < :now', { now: new Date() })
      .orderBy('event.date', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: events.map(event => this.mapEventResponse(event)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async findAll(): Promise<any[]> {
    const events = await this.getEventsBaseQuery()
        .orderBy('event.date', 'ASC')
        .getMany();
    return events.map(event => this.mapEventResponse(event));

  }

  async findOne(id: string): Promise<any> {
    const event = await this.getEventsBaseQuery()
      .where('event.id = :id', { id })
      .getOne();
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return this.mapEventResponse(event);
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
  }
}