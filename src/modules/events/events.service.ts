import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseMeta } from '../../common/type/response';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async create(dto: CreateEventDto) {
    const event = this.eventRepo.create({
      name: dto.name,
      date: new Date(dto.date),
      address: dto.address,
      addressUrl: dto.address_url,
      imageBackground: dto.image_background,
      description: dto.description,
      brochure: dto.brochure,
    });
    const saved = await this.eventRepo.save(event);
    return instanceToPlain(plainToInstance(EventEntity, saved), {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, keyword } = paginationDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<EventEntity> = {};
    if (keyword?.trim()) {
      where.name = ILike(`%${keyword.trim()}%`);
    }

    const [events, total] = await this.eventRepo.findAndCount({
      skip,
      take: limit,
      where,
      order: { id: 'ASC' },
    });

    const data = events.map((e) =>
      instanceToPlain(plainToInstance(EventEntity, e), {
        excludeExtraneousValues: true,
      }),
    ) as Record<string, unknown>[];
    const totalPage = Math.ceil(total / limit);
    const meta: ResponseMeta = { page, limit, total, total_page: totalPage };

    return { data, meta };
  }

  async findOne(id: number) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return instanceToPlain(plainToInstance(EventEntity, event), {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  async update(id: number, dto: UpdateEventDto) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    if (dto.name !== undefined) event.name = dto.name;
    if (dto.date !== undefined) event.date = new Date(dto.date);
    if (dto.address !== undefined) event.address = dto.address;
    if (dto.address_url !== undefined) event.addressUrl = dto.address_url;
    if (dto.image_background !== undefined)
      event.imageBackground = dto.image_background;
    if (dto.description !== undefined) event.description = dto.description;
    if (dto.brochure !== undefined) event.brochure = dto.brochure;

    const updated = await this.eventRepo.save(event);
    return instanceToPlain(plainToInstance(EventEntity, updated), {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  async remove(id: number) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    await this.eventRepo.remove(event);
    return { message: 'Event deleted successfully' };
  }
}
