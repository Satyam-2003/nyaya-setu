import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private stripeService: StripeService,
    private configService: ConfigService,
  ) {}

  @Post('create')
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto.caseId, dto.amount);
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') sig: string) {
    const secret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    const event = this.stripeService.constructEvent(req.rawBody, sig, secret);

    await this.paymentsService.handleWebhook(event);

    return { received: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @GetUser() user: any,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.paymentsService.findAll(user.id, Number(page), Number(limit));
  }
}
