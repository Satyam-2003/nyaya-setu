import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '../../database/postgres/entities/rating.entity';
import { Case } from '../../database/postgres/entities/case.entity';
import { Lawyer } from '../../database/postgres/entities/lawyer.entity';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Case, Lawyer]), UsersModule],
  providers: [RatingsService],
  controllers: [RatingsController],
})
export class RatingsModule {}
