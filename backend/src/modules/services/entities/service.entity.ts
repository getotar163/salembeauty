import { Entity, Column, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { MasterService } from './master-service.entity.js';
import type { Booking } from '../../bookings/entities/booking.entity.js';

@Entity('services')
export class Service extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'duration_minutes' })
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany('MasterService', 'service')
  masterServices: Relation<MasterService>[];

  @OneToMany('Booking', 'service')
  bookings: Relation<Booking>[];
}
