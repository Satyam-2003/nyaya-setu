import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Lawyer {
    @PrimaryGeneratedColumn('uuid')
     id!: string;

     @OneToOne(() => User, {eager: true, onDelete: 'CASCADE'})
     @JoinColumn()
     user!: User

     @Column()
     specialization!: string;
     
     @Column()
     experienceYears!: number;

     @Column()
     location!: string;

     @Column({ default: 0 })
     ratingAvg!: number;

     @Column({ default: 0 })
     totalCasesHandled!: number;

      @Column({ default: 0 })
      completionRate!: number;

      @Column({ default: 0 })
      responseTimeScore!: number;

      @Column({ default: 0 })
      trustScore!: number;

      @CreateDateColumn()
      createdAt!: Date;
}
