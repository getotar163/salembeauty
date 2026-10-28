import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { NotificationType } from '../../../common/enums/index.js';
import type { User } from '../../users/entities/user.entity.js';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne('User', 'notifications')
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
