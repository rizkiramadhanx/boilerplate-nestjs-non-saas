import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseProductDto } from './dto/base-product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ILike, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResponseMeta } from '../../common/type/response';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}
  async createProduct(createProductDto: BaseProductDto) {
    if (createProductDto.sku) {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: createProductDto.sku },
      });
      if (existingProduct) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    const { category_id, ...productData } = createProductDto;

    const newProduct = this.productRepository.create({
      ...productData,
      category: category_id ? ({ id: category_id } as any) : null,
      isActive:
        createProductDto.isActive !== undefined
          ? createProductDto.isActive
          : true,
    });

    const savedProduct = await this.productRepository.save(newProduct);
    const instance = plainToInstance(ProductEntity, savedProduct);
    return instanceToPlain(instance) as Record<string, unknown>;
  }

  async getAllProducts(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};
    if (paginationDto.keyword) {
      whereCondition.name = ILike(`%${paginationDto.keyword}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      where: whereCondition,
      relations: ['category'],
    });

    const productsSerialized = plainToInstance(ProductEntity, products);
    const list = Array.isArray(productsSerialized)
      ? productsSerialized
      : [productsSerialized];
    const data = list.map((p, i) => {
      const plain = instanceToPlain(p, {
        excludeExtraneousValues: true,
      }) as Record<string, unknown>;
      // Category dari hasil query (relation sudah di-load), supaya pasti muncul di response
      const raw = products[i];
      plain.category = raw?.category
        ? { id: raw.category.id, name: raw.category.name }
        : null;
      return plain;
    });

    const totalPage = Math.ceil(total / limit);

    const meta: ResponseMeta = {
      page: Number(page),
      limit: Number(limit),
      total,
      total_page: totalPage,
    };

    return {
      data,
      meta,
    };
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const instance = plainToInstance(ProductEntity, product);
    const plain = instanceToPlain(instance, {
      excludeExtraneousValues: true,
    }) as Record<string, unknown>;
    plain.category = product.category
      ? { id: product.category.id, name: product.category.name }
      : null;
    return plain;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Extract category_id from DTO
    const { category_id, ...productData } = updateProductDto;

    // Update product fields
    Object.assign(product, productData);

    // Handle category relationship update
    if (category_id !== undefined) {
      product.category = category_id ? ({ id: category_id } as any) : null;
    }

    const updatedProduct = await this.productRepository.save(product);
    const instance = plainToInstance(ProductEntity, updatedProduct);
    return instanceToPlain(instance) as Record<string, unknown>;
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  create(_id: string, createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    return this.productRepository.delete(id);
  }
}
