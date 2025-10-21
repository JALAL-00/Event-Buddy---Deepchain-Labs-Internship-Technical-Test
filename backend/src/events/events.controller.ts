import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdatePayloadDto } from './dto/update-payload.dto';
import { IdentifierDto } from './dto/identifier.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { Public } from '../common/decorators/public.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { multerOptions } from '../config/multer.config';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get('upcoming')
  findUpcoming(@Query() paginationDto: PaginationDto) {
    return this.eventsService.findUpcoming(paginationDto);
  }

  @Public()
  @Get('past')
  findPast(@Query() paginationDto: PaginationDto) {
    return this.eventsService.findPast(paginationDto);
  }

  @Public()
  @Post('/public/find')
  @HttpCode(HttpStatus.OK)
  publicFindOne(@Body() identifierDto: IdentifierDto) {
    return this.eventsService.findOne(identifierDto.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File) {
    if (file) createEventDto.imageUrl = `/uploads/${file.filename}`;
    delete (createEventDto as any).image;
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.eventsService.findAll();
  }

  @Post('/find')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  findOne(@Body() identifierDto: IdentifierDto) {
    return this.eventsService.findOne(identifierDto.id);
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Body() updatePayload: UpdatePayloadDto) {
    return this.eventsService.update(updatePayload.id, updatePayload.data);
  }

  @Delete()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() identifierDto: IdentifierDto) {
    return this.eventsService.remove(identifierDto.id);
  }
}
