import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Business } from '../../business/entities/business.entity.js';
import type { Master } from '../../masters/entities/master.entity.js';
import type { Booking } from '../../bookings/entities/booking.entity.js';

export enum TransactionType {
  INCOME = 'income', // e.g., haircuts, sales
  EXPENSE = 'expense', // e.g., supplies, rent
}

export enum IncomeCategory {
  SERVICE = 'service',
  PRODUCT = 'product',
  DEPOSIT = 'deposit',
  OTHER = 'other',
}

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ name: 'business_id', nullable: true })
  businessId: string;

  @ManyToOne('Business', 'transactions')
  @JoinColumn({ name: 'business_id' })
  business: Relation<Business>;

  @Column({ name: 'master_id', nullable: true })
  masterId: string;

  @ManyToOne('Master')
  @JoinColumn({ name: 'master_id' })
  master: Relation<Master>;

  @Column({ name: 'booking_id', nullable: true })
  bookingId: string;

  @ManyToOne('Booking', { nullable: true })
  @JoinColumn({ name: 'booking_id' })
  booking: Relation<Booking>;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: IncomeCategory,
    nullable: true,
  })
  category: IncomeCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
