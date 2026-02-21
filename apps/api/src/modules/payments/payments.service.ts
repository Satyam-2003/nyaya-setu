import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Payment,
  PaymentStatus,
} from 'src/database/postgres/entities/payment.entity';
import { Case, CaseStatus } from 'src/database/postgres/entities/case.entity';
import { StripeService } from './stripe.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../database/postgres/entities/notification.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Case)
    private caseRepo: Repository<Case>,

    private stripeService: StripeService,
    private notificationsService: NotificationsService,
  ) {}

  async createPayment(caseId: string, amount: number) {
    const legalCase = await this.caseRepo.findOne({
      where: { id: caseId },
    });

    if (!legalCase) throw new NotFoundException('Case not found');

    const session = await this.stripeService.createCheckoutSession(
      amount,
      caseId,
    );

    const payment = this.paymentRepo.create({
      case: legalCase,
      stripeSessionId: session.id,
      amount,
    });

    await this.paymentRepo.save(payment);

    return { checkoutUrl: session.url };
  }
  async handleWebhook(event: any) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const payment = await this.paymentRepo.findOne({
        where: { stripeSessionId: session.id },
      });

      if (payment) {
        payment.status = PaymentStatus.COMPLETED;
        await this.paymentRepo.save(payment);

        const legalCase = payment.case;
        legalCase.status = CaseStatus.CLOSED;
        await this.caseRepo.save(legalCase);
        // 🔔 Notify Client
        await this.notificationsService.create({
          recipientId: legalCase.client.id,
          title: 'Payment Successful',
          message: `Your payment for case "${legalCase.title}" was successful.`,
          type: NotificationType.PAYMENT_SUCCESS,
        });
      }
    }
  }
}
