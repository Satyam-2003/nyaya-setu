import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../database/postgres/entities/user.entity';
import { Lawyer } from '../../database/postgres/entities/lawyer.entity';
import { Case, CaseStatus } from '../../database/postgres/entities/case.entity';
import {
  Payment,
  PaymentStatus,
} from '../../database/postgres/entities/payment.entity';
import { Rating } from '../../database/postgres/entities/rating.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Lawyer)
    private lawyerRepo: Repository<Lawyer>,

    @InjectRepository(Case)
    private caseRepo: Repository<Case>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Rating)
    private ratingRepo: Repository<Rating>,
  ) {}

  async getPlatformStats() {
    const totalUsers = await this.userRepo.count();
    const totalLawyers = await this.lawyerRepo.count();
    const totalCases = await this.caseRepo.count();

    const openCases = await this.caseRepo.count({
      where: { status: CaseStatus.OPEN },
    });

    const closedCases = await this.caseRepo.count({
      where: { status: CaseStatus.CLOSED },
    });

    const payments = await this.paymentRepo.find({
      where: { status: PaymentStatus.COMPLETED },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const ratings = await this.ratingRepo.find();

    const avgPlatformRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return {
      totalUsers,
      totalLawyers,
      totalCases,
      openCases,
      closedCases,
      totalRevenue,
      avgPlatformRating: Number(avgPlatformRating.toFixed(2)),
    };
  }

  async getTopLawyers(limit = 5) {
    return this.lawyerRepo.find({
      order: { ratingAvg: 'DESC' },
      take: limit,
    });
  }

  async getMonthlyRevenue() {
    const result = await this.paymentRepo
      .createQueryBuilder('payment')
      .select("DATE_TRUNC('month', payment.createdAt)", 'month')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.status = :status', {
        status: PaymentStatus.COMPLETED,
      })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return result;
  }

  async getActiveCases() {
    return this.caseRepo.count({
      where: { status: CaseStatus.IN_PROGRESS },
    });
  }
}
