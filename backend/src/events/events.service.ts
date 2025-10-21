import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(newEvent);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({ order: { date: 'ASC' } });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.preload({
      id,
      ...updateEventDto,
    });
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return this.eventRepository.save(event);

  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async findUpcoming(paginationDto: PaginationDto) {

    const { page = 1, limit = 6 } = paginationDto;
    const skip = (page - 1) * limit;

    const [events, total] = await this.eventRepository.findAndCount({
      where: {
        date: MoreThan(new Date()),
      },
      order: {
        date: 'ASC',
      },
      take: limit,
      skip,
    });

    return {
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPast(paginationDto: PaginationDto) {
    
    const { page = 1, limit = 6 } = paginationDto;
    const skip = (page - 1) * limit;

    const [events, total] = await this.eventRepository.findAndCount({
      where: {
        date: LessThan(new Date()),
      },
      order: {
        date: 'DESC',
      },
      take: limit,
      skip,
    });

    return {
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}