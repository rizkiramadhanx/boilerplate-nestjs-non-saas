import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { EventCategoryEntity } from './entities/event-category.entity';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';
import { UpdateEventCategoryDto } from './dto/update-event-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseMeta } from '../../common/type/response';

@Injectable()
export class EventCategoriesService {
  constructor(
    @InjectRepository(EventCategoryEntity)
    private readonly categoryRepo: Repository<EventCategoryEntity>,
  ) {}

  async create(dto: CreateEventCategoryDto) {
    const category = this.categoryRepo.create({
      eventId: dto.event_id,
      name: dto.name,
      price: dto.price ?? 0,
      maxParticipant: dto.max_participant ?? null,
      description: dto.description,
    });
    const saved = await this.categoryRepo.save(category);
    return instanceToPlain(plainToInstance(EventCategoryEntity, saved), {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  async findAll(paginationDto: PaginationDto, eventId?: number) {
    const { page = 1, limit = 10, keyword } = paginationDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<EventCategoryEntity> = {};
    if (eventId != null) where.eventId = eventId;
    if (keyword?.trim()) {
      where.name = ILike(`%${keyword.trim()}%`);
    }

    const [categories, total] = await this.categoryRepo.findAndCount({
      skip,
      take: limit,
      where,
      relations: ['event'],
      order: { id: 'ASC' },
    });

    const data = categories.map((c) => {
      const plain = instanceToPlain(plainToInstance(EventCategoryEntity, c), {
        excludeExtraneousValues: true,
      }) as Record<string, unknown>;
      if (c.event) plain.event = { id: c.event.id, name: c.event.name };
      return plain;
    });
    const totalPage = Math.ceil(total / limit);
    const meta: ResponseMeta = { page, limit, total, total_page: totalPage };

    return { data, meta };
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['event'],
    });
    if (!category) throw new NotFoundException('Event category not found');
    const plain = instanceToPlain(
      plainToInstance(EventCategoryEntity, category),
      { excludeExtraneousValues: true },
    ) as Record<string, unknown>;
    if (category.event)
      plain.event = { id: category.event.id, name: category.event.name };
    return plain;
  }

  async update(id: number, dto: UpdateEventCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Event category not found');

    if (dto.event_id !== undefined) category.eventId = dto.event_id;
    if (dto.name !== undefined) category.name = dto.name;
    if (dto.price !== undefined) category.price = dto.price;
    if (dto.max_participant !== undefined)
      category.maxParticipant = dto.max_participant;
    if (dto.description !== undefined) category.description = dto.description;

    const updated = await this.categoryRepo.save(category);
    return instanceToPlain(plainToInstance(EventCategoryEntity, updated), {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Event category not found');
    await this.categoryRepo.remove(category);
    return { message: 'Event category deleted successfully' };
  }
}
