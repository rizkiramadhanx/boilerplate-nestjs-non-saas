import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';
import { EventCategoryEntity } from './event-category.entity';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  @Expose({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Expose({ name: 'name' })
  name: string;

  @Column({ type: 'date' })
  @Expose({ name: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 500 })
  @Expose({ name: 'address' })
  address: string;

  @Column({ name: 'address_url', type: 'varchar', length: 500, nullable: true })
  @Expose({ name: 'address_url' })
  addressUrl: string;

  @Column({
    name: 'image_background',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  @Expose({ name: 'image_background' })
  imageBackground: string;

  @Column({ type: 'text', nullable: true })
  @Expose({ name: 'description' })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Expose({ name: 'brochure' })
  brochure: string;

  @OneToMany(() => UserEntity, (user) => user.event)
  @Exclude()
  users: UserEntity[];

  @OneToMany(() => EventCategoryEntity, (category) => category.event)
  @Exclude()
  eventCategories: EventCategoryEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
