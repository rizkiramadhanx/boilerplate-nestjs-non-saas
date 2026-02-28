import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('history_registration')
export class HistoryRegistrationEntity {
  @PrimaryGeneratedColumn()
  @Expose({ name: 'id' })
  id: number;

  @Column({ name: 'event_category_id', type: 'int' })
  @Expose({ name: 'event_category_id' })
  eventCategoryId: number;

  @Column({ name: 'event_name', type: 'varchar', length: 255 })
  @Expose({ name: 'event_name' })
  eventName: string;

  @Column({ name: 'event_category_name', type: 'varchar', length: 255 })
  @Expose({ name: 'event_category_name' })
  eventCategoryName: string;

  @Column({ type: 'int', default: 0 })
  @Expose({ name: 'price' })
  price: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
