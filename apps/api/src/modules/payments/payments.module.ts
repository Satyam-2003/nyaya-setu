import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../database/postgres/entities/payment.entity';
import { Case } from '../../database/postgres/entities/case.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Case]),
    ConfigModule,
    NotificationsModule,
  ],
  providers: [PaymentsService, StripeService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
