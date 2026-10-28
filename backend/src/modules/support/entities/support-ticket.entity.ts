import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { TicketStatus } from '../../../common/enums/index.js';
import type { User } from '../../users/entities/user.entity.js';
import type { SupportMessage } from './support-message.entity.js';

@Entity('support_tickets')
export class SupportTicket extends BaseEntity {
  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne('User', 'supportTickets')
  @JoinColumn({ name: 'client_id' })
  client: Relation<User>;

  @Column()
  subject: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @OneToMany('SupportMessage', 'ticket')
  messages: Relation<SupportMessage>[];
}
