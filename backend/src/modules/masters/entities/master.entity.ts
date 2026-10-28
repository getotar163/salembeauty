import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { User } from '../../users/entities/user.entity.js';
import type { MasterService } from '../../services/entities/master-service.entity.js';
import type { Booking } from '../../bookings/entities/booking.entity.js';
import type { Review } from '../../reviews/entities/review.entity.js';
import type { Schedule } from '../../schedule/entities/schedule.entity.js';
import type { ScheduleException } from '../../schedule/entities/schedule-exception.entity.js';
import type { Business } from '../../business/entities/business.entity.js';

@Entity('masters')
export class Master extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne('User', 'master')
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ name: 'business_id', nullable: true })
  businessId: string;

  @ManyToOne('Business', 'masters', { nullable: true })
  @JoinColumn({ name: 'business_id' })
  business: Relation<Business>;

  @Column()
  specialization: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ name: 'reviews_count', default: 0 })
  reviewsCount: number;

  @Column({ name: 'experience_years', default: 0 })
  experienceYears: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ name: 'portfolio_images', type: 'jsonb', nullable: true })
  portfolioImages: string[];

  @OneToMany('MasterService', 'master')
  masterServices: Relation<MasterService>[];

  @OneToMany('Booking', 'master')
  bookings: Relation<Booking>[];

  @OneToMany('Review', 'master')
  reviews: Relation<Review>[];

  @OneToMany('Schedule', 'master')
  schedules: Relation<Schedule>[];

  @OneToMany('ScheduleException', 'master')
  scheduleExceptions: Relation<ScheduleException>[];
}
