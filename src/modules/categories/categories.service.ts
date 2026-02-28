import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResponseMeta } from '../../common/type/response';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
    });

    const savedCategory = await this.categoryRepository.save(category);
    const instance = plainToInstance(CategoryEntity, savedCategory);
    return instanceToPlain(instance) as Record<string, unknown>;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const keyword = paginationDto.keyword ?? '';
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
      where: { name: ILike(`%${keyword}%`) },
    });

    const categoriesSerialized = plainToInstance(CategoryEntity, categories, {
      excludeExtraneousValues: true,
    });
    const data = (
      Array.isArray(categoriesSerialized)
        ? categoriesSerialized
        : [categoriesSerialized]
    ).map((c) => instanceToPlain(c) as Record<string, unknown>);
    const totalPage = Math.ceil(total / limit);

    const meta: ResponseMeta = {
      page,
      limit,
      total,
      total_page: totalPage,
    };

    return {
      data,
      meta,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const instance = plainToInstance(CategoryEntity, category, {
      excludeExtraneousValues: true,
    });
    return instanceToPlain(instance);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);
    const instance = plainToInstance(CategoryEntity, updatedCategory);
    return instanceToPlain(instance) as Record<string, unknown>;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
