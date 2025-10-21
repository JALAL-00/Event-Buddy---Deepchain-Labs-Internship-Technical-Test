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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdatePayloadDto } from './dto/update-payload.dto';
import { IdentifierDto } from './dto/identifier.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { multerOptions } from '../config/multer.config';

@Controller('events')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(UserRole.ADMIN)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createEventDto.imageUrl = `/uploads/${file.filename}`;
    }
    delete (createEventDto as any).image;
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post('/find')
  @HttpCode(HttpStatus.OK)
  findOne(@Body() identifierDto: IdentifierDto) {
    return this.eventsService.findOne(identifierDto.id);
  }

  @Patch()
  update(@Body() updatePayload: UpdatePayloadDto) {
    return this.eventsService.update(updatePayload.id, updatePayload.data);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() identifierDto: IdentifierDto) {
    return this.eventsService.remove(identifierDto.id);
  }
}
