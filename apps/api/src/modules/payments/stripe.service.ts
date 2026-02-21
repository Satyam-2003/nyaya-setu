import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(
    amount: number,
    caseId: string,
  ) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Legal Case Payment`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { caseId },
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
  }

  constructEvent(payload: Buffer, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      sig,
      secret,
    );
  }
}