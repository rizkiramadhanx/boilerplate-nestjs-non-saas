import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateUserDto } from './dto/base-user.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ResponseMeta } from '../../common/type/response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      name: createUserDto.name ?? null,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role_id ? { id: createUserDto.role_id } : undefined,
    });

    const savedUser = await this.userRepository.save(newUser);
    const instance = plainToInstance(UserEntity, savedUser);
    return instanceToPlain(instance, {
      exposeDefaultValues: true,
    }) as Record<string, unknown>;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const instance = plainToInstance(UserEntity, user);
    return instanceToPlain(instance, {
      exposeDefaultValues: true,
    }) as Record<string, unknown>;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.role_id) {
      user.role = { id: updateUserDto.role_id } as any;
    }

    // Assign other fields
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password;

    const updatedUser = await this.userRepository.save(user);
    const instance = plainToInstance(UserEntity, updatedUser);
    return instanceToPlain(instance, {
      exposeDefaultValues: true,
    }) as Record<string, unknown>;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async updateUserProfile(email: string, user: UpdateUserDto) {
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (!userExists) throw new NotFoundException('User not found');

    if (user.name) userExists.name = user.name;
    if (user.email) userExists.email = user.email;
    if (user.password) {
      userExists.password = await bcrypt.hash(user.password, 10);
    }
    if (user.role_id) userExists.role = { id: user.role_id } as any;

    const updated = await this.userRepository.save(userExists);
    const instance = plainToInstance(UserEntity, updated);
    return instanceToPlain(instance, { exposeDefaultValues: true }) as Record<
      string,
      unknown
    >;
  }

  async getAllUser(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};
    if (paginationDto.keyword?.trim()) {
      whereCondition.name = ILike(`%${paginationDto.keyword.trim()}%`);
    }

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      relations: ['role'],
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: {
          id: true,
          name: true,
          actions: true,
        },
      },
      where: whereCondition,
    });

    const usersSerialized = plainToInstance(UserEntity, users);
    const data = (
      Array.isArray(usersSerialized) ? usersSerialized : [usersSerialized]
    ).map(
      (u) =>
        instanceToPlain(u, { exposeDefaultValues: true }) as Record<
          string,
          unknown
        >,
    );
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
}
