import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { EventCategoryEntity } from './event-category.entity';

@Entity('participant')
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  @Expose({ name: 'id' })
  id: number;

  @Column({ name: 'event_category_id', type: 'int' })
  @Expose({ name: 'event_category_id' })
  eventCategoryId: number;

  @Column({ type: 'varchar', length: 255 })
  @Expose({ name: 'name' })
  name: string;

  @Column({ name: 'bird_name', type: 'varchar', length: 255, nullable: true })
  @Expose({ name: 'bird_name' })
  birdName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Expose({ name: 'address' })
  address: string;

  @Column({ type: 'int', nullable: true })
  @Expose({ name: 'position' })
  position: number | null;

  @ManyToOne(() => EventCategoryEntity, (category) => category.participants)
  @JoinColumn({ name: 'event_category_id' })
  eventCategory: EventCategoryEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
