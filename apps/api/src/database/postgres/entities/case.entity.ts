import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Lawyer } from './lawyer.entity';

export enum CaseStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

@Entity()
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  category!: string;

  @Column({
    type: 'enum',
    enum: CaseStatus,
    default: CaseStatus.OPEN,
  })
  status!: CaseStatus;

  @ManyToOne(() => User, { eager: true })
  client!: User;

  @ManyToOne(() => Lawyer, { nullable: true, eager: true })
  lawyer!: Lawyer;

  @CreateDateColumn()
  createdAt!: Date;
}
