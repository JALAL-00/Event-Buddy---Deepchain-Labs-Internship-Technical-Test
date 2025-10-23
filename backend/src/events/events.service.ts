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

  // --- PERMANENT FIX: This function is now robust against various time formats ---
  private combineDateAndTime(date: string, time: string): Date {
    // Matches HH:mm with optional space and case-insensitive AM/PM (e.g., 10:00AM, 02:30 PM)
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
    const match = time.match(timeRegex);

    if (!match) {
      throw new BadRequestException('Invalid time format. Please use a format like "10:00AM" or "02:30 PM".');
    }
    
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const modifier = match[3]?.toUpperCase();

    if (isNaN(hours) || isNaN(minutes)) {
       throw new BadRequestException('Invalid time values.');
    }

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      // Midnight case (12:xx AM becomes 00:xx)
      hours = 0;
    }
    
    const eventDate = new Date(date);
    // Setting UTC hours prevents timezone-related bugs where the day might shift.
    eventDate.setUTCHours(hours, minutes, 0, 0); 
    
    return eventDate;
  }
  // --- END OF FIX ---

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { date, time, imageUrl, capacity, tags, ...restDto } = createEventDto;
    
    if (!date || !time) {
      throw new BadRequestException("Date and time are required.");
    }
    
    const numericCapacity = parseInt(String(capacity), 10);
    if (isNaN(numericCapacity) || numericCapacity <= 0) {
        throw new BadRequestException("Capacity must be a valid positive number.");
    }

    let tagsArray: string[] = [];
    if (tags && typeof tags === 'string' && tags.trim() !== '') {
        tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
        tagsArray = tags;
    }

    const eventDate = this.combineDateAndTime(date, time);
    
    const newEvent = this.eventRepository.create({
      ...restDto,
      imageUrl,
      date: eventDate,
      capacity: numericCapacity,
      tags: tagsArray,
    });
    
    return this.eventRepository.save(newEvent);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) throw new NotFoundException(`Event with ID "${id}" not found`);
    
    if (updateEventDto.tags && typeof updateEventDto.tags === 'string') {
        (updateEventDto.tags as any) = updateEventDto.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    const dtoWithConvertedTypes = {
      ...updateEventDto,
      capacity: updateEventDto.capacity
        ? parseInt(String(updateEventDto.capacity), 10)
        : event.capacity,
    };

    Object.assign(event, dtoWithConvertedTypes);

    if (updateEventDto.date && updateEventDto.time) {
      event.date = this.combineDateAndTime(updateEventDto.date, updateEventDto.time);
    }

    return this.eventRepository.save(event);
  }

  async findUpcoming(paginationDto: PaginationDto) {
    const page = paginationDto.page || 1; const limit = paginationDto.limit || 6; const skip = (page - 1) * limit;
    const [events, total] = await this.getEventsBaseQuery().where('event.date > :now', { now: new Date() }).orderBy('event.date', 'ASC').skip(skip).take(limit).getManyAndCount();
    return { data: events.map(event => this.mapEventResponse(event)), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findPast(paginationDto: PaginationDto) {
    const page = paginationDto.page || 1; const limit = paginationDto.limit || 6; const skip = (page - 1) * limit;
    const [events, total] = await this.getEventsBaseQuery().where('event.date < :now', { now: new Date() }).orderBy('event.date', 'DESC').skip(skip).take(limit).getManyAndCount();
    return { data: events.map(event => this.mapEventResponse(event)), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAll(): Promise<any[]> {
    const events = await this.getEventsBaseQuery().orderBy('event.date', 'ASC').getMany();
    return events.map(event => this.mapEventResponse(event));
  }

  async findOne(id: string): Promise<any> {
    const event = await this.getEventsBaseQuery().where('event.id = :id', { id }).getOne();
    if (!event) throw new NotFoundException(`Event with ID "${id}" not found`);
    return this.mapEventResponse(event);
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Event with ID "${id}" not found`);
  }
}
