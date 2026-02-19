import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Lawyer } from './lawyer.entity';
import { Case } from './case.entity';

@Entity()
@Unique(['case'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  client!: User;

  @ManyToOne(() => Lawyer, { eager: true })
  lawyer!: Lawyer;

  @ManyToOne(() => Case, { eager: true })
  case!: Case;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  review!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
