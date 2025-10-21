import { Injectable, NotFoundException } from '@nestjs/common';
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
      .leftJoin(
        (subQuery) =>
          subQuery
            .select('booking."eventId", SUM(booking."numberOfSeats") as "totalBookedSeats"')
            .from(Booking, 'booking')
            .groupBy('booking."eventId"'),
        'bookings',
        'bookings."eventId" = event.id',
      )
      .addSelect('COALESCE(bookings."totalBookedSeats", 0)', 'bookedSeats');
  }

  private mapEventResponse(event: any): any {
    const bookedSeats = parseInt(event.bookedSeats, 10) || 0;
    const { bookedSeats: rawBooked, ...restOfEvent } = event;
    return {
      ...restOfEvent,
      bookedSeats,
      spotsLeft: event.capacity - bookedSeats,
    };
  }

  async findUpcoming(paginationDto: PaginationDto) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 6;
    const skip = (page - 1) * limit;

    const queryBuilder = this.getEventsBaseQuery()
      .where('event.date > :now', { now: new Date() })
      .orderBy('event.date', 'ASC')
      .skip(skip)
      .take(limit);

    const { entities: events, raw } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    const enrichedEntities = events.map((entity, index) => {
        const raw = queryBuilder.getRawMany()[index];
        return this.mapEventResponse({...entity, bookedSeats: raw?.bookedSeats ?? '0'});
    })
    
    return {
      data: enrichedEntities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async findPast(paginationDto: PaginationDto) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 6;
    const skip = (page - 1) * limit;

    const queryBuilder = this.getEventsBaseQuery()
      .where('event.date < :now', { now: new Date() })
      .orderBy('event.date', 'DESC')
      .skip(skip)
      .take(limit);

    const { entities: events, raw } = await queryBuilder.getRawAndEntities();
    const total = await queryBuilder.getCount();

    const enrichedEntities = events.map((entity, index) => {
        const raw = queryBuilder.getRawMany()[index];
        return this.mapEventResponse({...entity, bookedSeats: raw?.bookedSeats ?? '0'});
    })

    return {
      data: enrichedEntities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async findAll(): Promise<any[]> {
    const queryBuilder = this.getEventsBaseQuery().orderBy('event.date', 'ASC');
    const { entities, raw } = await queryBuilder.getRawAndEntities();

    return entities.map((entity, index) => {
        return this.mapEventResponse({...entity, bookedSeats: raw[index]?.bookedSeats ?? '0'});
    });
  }
  
  async findOne(id: string): Promise<any> {
    const queryBuilder = this.getEventsBaseQuery()
        .where('event.id = :id', { id });
    
    const { entities, raw } = await queryBuilder.getRawAndEntities();

    if (!entities.length) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    const entity = entities[0];
    const rawData = raw[0];

    return this.mapEventResponse({...entity, bookedSeats: rawData?.bookedSeats ?? '0'});
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(newEvent);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.preload({ id, ...updateEventDto });
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
  }
}