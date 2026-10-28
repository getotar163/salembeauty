import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { BookingStatus } from '../../../common/enums/index.js';
import type { User } from '../../users/entities/user.entity.js';
import type { Master } from '../../masters/entities/master.entity.js';
import type { Service } from '../../services/entities/service.entity.js';
import type { Review } from '../../reviews/entities/review.entity.js';

@Entity('bookings')
export class Booking extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne('User', 'bookings')
  @JoinColumn({ name: 'client_id' })
  client: Relation<User>;

  @Column({ name: 'master_id' })
  masterId: string;

  @ManyToOne('Master', 'bookings')
  @JoinColumn({ name: 'master_id' })
  master: Relation<Master>;

  @Column({ name: 'service_id' })
  serviceId: string;

  @ManyToOne('Service', 'bookings')
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ name: 'client_note', type: 'text', nullable: true })
  clientNote: string;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @OneToOne('Review', 'booking')
  review: Relation<Review>;
}
