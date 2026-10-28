import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { ApplicationStatus } from '../../../common/enums/index.js';
import type { User } from '../../users/entities/user.entity.js';

@Entity('master_applications')
export class MasterApplication extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne('User', 'masterApplications')
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column()
  specialization: string;

  @Column({ name: 'experience_years', type: 'int' })
  experienceYears: number;

  @Column({ type: 'text' })
  resume_text: string;

  @Column({ type: 'jsonb', nullable: true })
  portfolio_links: string[];

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;
}
