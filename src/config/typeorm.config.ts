import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../modules/users/entities/user.entity';
import { RoleEntity } from '../modules/roles/entities/role.entity';
import { CategoryEntity } from '../modules/categories/entities/category.entity';
import { LogEntity } from '../modules/logs/entities/log.entity';
import { EventEntity } from '../modules/events/entities/event.entity';
import { EventCategoryEntity } from '../modules/events/entities/event-category.entity';
import { ParticipantEntity } from '../modules/events/entities/participant.entity';
import { RegistrationEventEntity } from '../modules/events/entities/registration-event.entity';
import { HistoryRegistrationEntity } from '../modules/events/entities/history-registration.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'crudnest',
  entities: [
    UserEntity,
    RoleEntity,
    CategoryEntity,
    LogEntity,
    EventEntity,
    EventCategoryEntity,
    ParticipantEntity,
    RegistrationEventEntity,
    HistoryRegistrationEntity,
  ],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
  logging: true,
});
