import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../database/postgres/entities/user.entity';
import { Lawyer } from '../../database/postgres/entities/lawyer.entity';
import { Case } from '../../database/postgres/entities/case.entity';
import { Payment } from '../../database/postgres/entities/payment.entity';
import { Rating } from '../../database/postgres/entities/rating.entity';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lawyer, Case, Payment, Rating])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
