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

@Entity('registration_event')
export class RegistrationEventEntity {
  @PrimaryGeneratedColumn()
  @Expose({ name: 'id' })
  id: number;

  @Column({ name: 'event_category_id', type: 'int' })
  @Expose({ name: 'event_category_id' })
  eventCategoryId: number;

  @Column({ type: 'varchar', length: 255 })
  @Expose({ name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  @Expose({ name: 'phone' })
  phone: string;

  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  @Expose({ name: 'expired_at' })
  expiredAt: Date | null;

  @Column({ name: 'time_reregistration', type: 'time', nullable: true })
  @Expose({ name: 'time_reregistration' })
  timeReregistration: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Expose({ name: 'status' })
  status: string;

  @ManyToOne(
    () => EventCategoryEntity,
    (category) => category.registrationEvents,
  )
  @JoinColumn({ name: 'event_category_id' })
  eventCategory: EventCategoryEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
