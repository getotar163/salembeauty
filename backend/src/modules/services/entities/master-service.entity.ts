import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Master } from '../../masters/entities/master.entity.js';
import type { Service } from './service.entity.js';

@Entity('master_services')
export class MasterService extends BaseEntity {
  @Column({ name: 'master_id' })
  masterId: string;

  @ManyToOne('Master', 'masterServices')
  @JoinColumn({ name: 'master_id' })
  master: Relation<Master>;

  @Column({ name: 'service_id' })
  serviceId: string;

  @ManyToOne('Service', 'masterServices')
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @Column({ name: 'custom_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  customPrice: number;

  @Column({ name: 'custom_duration', nullable: true })
  customDuration: number;
}
