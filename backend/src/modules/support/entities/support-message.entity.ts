import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import type { User } from '../../users/entities/user.entity.js';
import type { SupportTicket } from './support-ticket.entity.js';

@Entity('support_messages')
export class SupportMessage extends BaseEntity {
  @Column({ name: 'ticket_id' })
  ticketId: string;

  @ManyToOne('SupportTicket', 'messages')
  @JoinColumn({ name: 'ticket_id' })
  ticket: Relation<SupportTicket>;

  @Column({ name: 'sender_id' })
  senderId: string;

  @ManyToOne('User', 'sentMessages')
  @JoinColumn({ name: 'sender_id' })
  sender: Relation<User>;

  @Column({ type: 'text' })
  message_text: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;
}
