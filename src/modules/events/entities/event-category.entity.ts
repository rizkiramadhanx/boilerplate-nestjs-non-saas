import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { EventEntity } from './event.entity';
import { ParticipantEntity } from './participant.entity';
import { RegistrationEventEntity } from './registration-event.entity';

@Entity('event_category')
export class EventCategoryEntity {
  @PrimaryGeneratedColumn()
  @Expose({ name: 'id' })
  id: number;

  @Column({ name: 'event_id', type: 'int' })
  @Expose({ name: 'event_id' })
  eventId: number;

  @Column({ type: 'varchar', length: 255 })
  @Expose({ name: 'name' })
  name: string;

  @Column({ type: 'int', default: 0 })
  @Expose({ name: 'price' })
  price: number;

  @Column({ name: 'max_participant', type: 'int', nullable: true })
  @Expose({ name: 'max_participant' })
  maxParticipant: number | null;

  @Column({ type: 'text', nullable: true })
  @Expose({ name: 'description' })
  description: string;

  @ManyToOne(() => EventEntity, (event) => event.eventCategories)
  @JoinColumn({ name: 'event_id' })
  @Exclude()
  event: EventEntity;

  @OneToMany(
    () => ParticipantEntity,
    (participant) => participant.eventCategory,
  )
  @Exclude()
  participants: ParticipantEntity[];

  @OneToMany(() => RegistrationEventEntity, (reg) => reg.eventCategory)
  @Exclude()
  registrationEvents: RegistrationEventEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
