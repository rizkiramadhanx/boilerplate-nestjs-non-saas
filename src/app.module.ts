import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RolesModule } from './modules/roles/roles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MailModule } from './modules/mailer/mailer.module';
import { LogsModule } from './modules/logs/logs.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    LogsModule,
    EventsModule,
    AuthModule,
    UsersModule,
    MailModule,
    RolesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
