import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  @Expose({ name: 'id' })
  id: number;

  @Column({ length: 255 })
  @Expose({ name: 'name' })
  name: string;

  @Column({ type: 'simple-array', nullable: true, default: '' })
  @Expose({ name: 'actions' })
  actions: string[];

  @OneToMany(() => UserEntity, (user) => user.role)
  @Exclude()
  users: UserEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
