import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { UserRole } from '../../../common/enums/index.js';
import type { Master } from '../../masters/entities/master.entity.js';
import type { Booking } from '../../bookings/entities/booking.entity.js';
import type { Review } from '../../reviews/entities/review.entity.js';
import type { Notification } from '../../notifications/entities/notification.entity.js';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'refresh_token', nullable: true, select: false })
  refreshToken: string;

  @OneToOne('Master', 'user')
  master: Relation<Master>;

  @OneToMany('Booking', 'client')
  bookings: Relation<Booking>[];

  @OneToMany('Review', 'client')
  reviews: Relation<Review>[];

  @OneToMany('Notification', 'user')
  notifications: Relation<Notification>[];

  @OneToMany('MasterApplication', 'user')
  masterApplications: Relation<any>[]; // using 'any' or importing the type to avoid more circular deps

  @OneToMany('SupportTicket', 'client')
  supportTickets: Relation<any>[];

  @OneToMany('SupportMessage', 'sender')
  sentMessages: Relation<any>[];
}
