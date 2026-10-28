import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { User } from '../../users/entities/user.entity.js';
import type { Master } from '../../masters/entities/master.entity.js';
import type { Booking } from '../../bookings/entities/booking.entity.js';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column({ name: 'booking_id' })
  bookingId: string;

  @OneToOne('Booking', 'review')
  @JoinColumn({ name: 'booking_id' })
  booking: Relation<Booking>;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne('User', 'reviews')
  @JoinColumn({ name: 'client_id' })
  client: Relation<User>;

  @Column({ name: 'master_id' })
  masterId: string;

  @ManyToOne('Master', 'reviews')
  @JoinColumn({ name: 'master_id' })
  master: Relation<Master>;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;
}
