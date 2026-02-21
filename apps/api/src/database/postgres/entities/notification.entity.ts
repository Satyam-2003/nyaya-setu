import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  CASE_ASSIGNED = 'case_assigned',
  PAYMENT_SUCCESS = 'payment_success',
  NEW_MESSAGE = 'new_message',
  RATING_RECEIVED = 'rating_received',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  recipient!: User;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type!: NotificationType;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
