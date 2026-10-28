import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { Master } from '../../masters/entities/master.entity.js';

@Entity('schedule_exceptions')
export class ScheduleException extends BaseEntity {
  @Column({ name: 'master_id' })
  masterId: string;

  @ManyToOne('Master', 'scheduleExceptions')
  @JoinColumn({ name: 'master_id' })
  master: Relation<Master>;

  @Column({ name: 'exception_date', type: 'date' })
  exceptionDate: Date;

  @Column({ name: 'is_day_off', default: true })
  isDayOff: boolean;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string;

  @Column({ nullable: true })
  reason: string;
}
