import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { User } from '../../users/entities/user.entity.js';
import type { Master } from '../../masters/entities/master.entity.js';
import type { Transaction } from '../../transactions/entities/transaction.entity.js';

@Entity('businesses')
export class Business extends BaseEntity {
  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: Relation<User>;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @OneToMany('Master', 'business')
  masters: Relation<Master>[];

  @OneToMany('Transaction', 'business')
  transactions: Relation<Transaction>[];
}
