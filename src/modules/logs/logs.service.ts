import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './entities/log.entity';

export interface CreateLogDto {
  action: string;
  userId?: number;
  status: string;
  statusCode?: number;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  async createLog(dto: CreateLogDto): Promise<LogEntity> {
    const log = this.logRepository.create({
      action: dto.action,
      userId: dto.userId ?? null,
      status: dto.status,
      statusCode: dto.statusCode != null ? String(dto.statusCode) : null,
    });
    return this.logRepository.save(log);
  }
}
