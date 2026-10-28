import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { DayOfWeek } from '../../../common/enums/index.js';
import type { Master } from '../../masters/entities/master.entity.js';

@Entity('schedules')
export class Schedule extends BaseEntity {
  @Column({ name: 'master_id' })
  masterId: string;

  @ManyToOne('Master', 'schedules')
  @JoinColumn({ name: 'master_id' })
  master: Relation<Master>;

  @Column({
    name: 'day_of_week',
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'is_working', default: true })
  isWorking: boolean;
}
