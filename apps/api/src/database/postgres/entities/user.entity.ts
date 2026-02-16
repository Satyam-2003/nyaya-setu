import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  CLIENT = 'client',
  LAWYER = 'lawyer',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  name: string | undefined;

  @Column({ unique: true })
  email: string | undefined;

  @Column()
  password: string | undefined;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;
}
