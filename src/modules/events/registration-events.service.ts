import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { RegistrationEventEntity } from './entities/registration-event.entity';
import { CreateRegistrationEventDto } from './dto/create-registration-event.dto';
import { UpdateRegistrationEventDto } from './dto/update-registration-event.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseMeta } from '../../common/type/response';

@Injectable()
export class RegistrationEventsService {
  constructor(
    @InjectRepository(RegistrationEventEntity)
    private readonly registrationRepo: Repository<RegistrationEventEntity>,
  ) {}

  async create(dto: CreateRegistrationEventDto) {
    const reg = this.registrationRepo.create({
      eventCategoryId: dto.event_category_id,
      name: dto.name,
      phone: dto.phone,
      expiredAt: dto.expired_at ? new Date(dto.expired_at) : null,
      timeReregistration: dto.time_reregistration ?? null,
      status: dto.status ?? null,
    });
    const saved = await this.registrationRepo.save(reg);
    return instanceToPlain(plainToInstance(RegistrationEventEntity, saved), {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  async findAll(
    paginationDto: PaginationDto,
    eventCategoryId?: number,
  ) {
    const { page = 1, limit = 10, keyword } = paginationDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<RegistrationEventEntity> = {};
    if (eventCategoryId != null) where.eventCategoryId = eventCategoryId;
    if (keyword?.trim()) {
      where.name = ILike(`%${keyword.trim()}%`);
    }

    const [list, total] = await this.registrationRepo.findAndCount({
      skip,
      take: limit,
      where,
      relations: ['eventCategory'],
      order: { id: 'ASC' },
    });

    const data = list.map((r) => {
      const plain = instanceToPlain(
        plainToInstance(RegistrationEventEntity, r),
        { excludeExtraneousValues: true },
      ) as Record<string, unknown>;
      if (r.eventCategory)
        plain.event_category = {
          id: r.eventCategory.id,
          name: r.eventCategory.name,
        };
      return plain;
    });
    const totalPage = Math.ceil(total / limit);
    const meta: ResponseMeta = { page, limit, total, total_page: totalPage };

    return { data, meta };
  }

  async findOne(id: number) {
    const reg = await this.registrationRepo.findOne({
      where: { id },
      relations: ['eventCategory'],
    });
    if (!reg) throw new NotFoundException('Registration event not found');
    const plain = instanceToPlain(
      plainToInstance(RegistrationEventEntity, reg),
      { excludeExtraneousValues: true },
    ) as Record<string, unknown>;
    if (reg.eventCategory)
      plain.event_category = {
        id: reg.eventCategory.id,
        name: reg.eventCategory.name,
      };
    return plain;
  }

  async update(id: number, dto: UpdateRegistrationEventDto) {
    const reg = await this.registrationRepo.findOne({ where: { id } });
    if (!reg) throw new NotFoundException('Registration event not found');

    if (dto.event_category_id !== undefined)
      reg.eventCategoryId = dto.event_category_id;
    if (dto.name !== undefined) reg.name = dto.name;
    if (dto.phone !== undefined) reg.phone = dto.phone;
    if (dto.expired_at !== undefined)
      reg.expiredAt = dto.expired_at ? new Date(dto.expired_at) : null;
    if (dto.time_reregistration !== undefined)
      reg.timeReregistration = dto.time_reregistration;
    if (dto.status !== undefined) reg.status = dto.status;

    const updated = await this.registrationRepo.save(reg);
    return instanceToPlain(plainToInstance(RegistrationEventEntity, updated), {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
  }

  async remove(id: number) {
    const reg = await this.registrationRepo.findOne({ where: { id } });
    if (!reg) throw new NotFoundException('Registration event not found');
    await this.registrationRepo.remove(reg);
    return { message: 'Registration event deleted successfully' };
  }
}
