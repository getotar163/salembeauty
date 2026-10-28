import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { appConfig } from './config/app.config.js';
import { jwtConfig } from './config/jwt.config.js';
import { databaseConfig } from './config/database.config.js';

// Entities
import { User } from './modules/users/entities/user.entity.js';
import { Master } from './modules/masters/entities/master.entity.js';
import { Service } from './modules/services/entities/service.entity.js';
import { MasterService } from './modules/services/entities/master-service.entity.js';
import { Booking } from './modules/bookings/entities/booking.entity.js';
import { Review } from './modules/reviews/entities/review.entity.js';
import { Schedule } from './modules/schedule/entities/schedule.entity.js';
import { ScheduleException } from './modules/schedule/entities/schedule-exception.entity.js';
import { Notification } from './modules/notifications/entities/notification.entity.js';

import { MasterApplication } from './modules/masters/entities/master-application.entity.js';
import { SupportTicket } from './modules/support/entities/support-ticket.entity.js';
import { SupportMessage } from './modules/support/entities/support-message.entity.js';
import { Business } from './modules/business/entities/business.entity.js';
import { Transaction } from './modules/transactions/entities/transaction.entity.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, jwtConfig],
    }),

    // Database
    TypeOrmModule.forRoot({
      ...databaseConfig(),
      entities: [
        User,
        Master,
        Service,
        MasterService,
        Booking,
        Review,
        Schedule,
        ScheduleException,
        Notification,
        MasterApplication,
        SupportTicket,
        SupportMessage,
        Business,
        Transaction,
      ],
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
