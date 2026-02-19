import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from 'src/database/postgres/entities/rating.entity';
import { Case, CaseStatus } from 'src/database/postgres/entities/case.entity';
import { Lawyer } from 'src/database/postgres/entities/lawyer.entity';
import { UsersService } from '../users/users.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepo: Repository<Rating>,

    @InjectRepository(Case)
    private caseRepo: Repository<Case>,

    @InjectRepository(Lawyer)
    private lawyerRepo: Repository<Lawyer>,

    private usersService: UsersService,
  ) {}

  async create(clientId: string, dto: CreateRatingDto) {
    const legalCase = await this.caseRepo.findOne({
      where: { id: dto.caseId },
    });

    if (!legalCase) throw new NotFoundException('Case not found');

    if (legalCase.status !== CaseStatus.CLOSED) {
      throw new ForbiddenException('Case must be closed before rating');
    }

    if (legalCase.client.id !== clientId) {
      throw new ForbiddenException('You can only rate your own case');
    }

    const existing = await this.ratingRepo.findOne({
      where: { case: { id: dto.caseId } },
    });

    if (existing) {
      throw new ForbiddenException('Rating already submitted for this case');
    }

    if (!legalCase.lawyer) {
      throw new ForbiddenException('No lawyer assigned to this case');
    }

    const rating = this.ratingRepo.create({
      client: legalCase.client,
      lawyer: legalCase.lawyer,
      case: legalCase,
      rating: dto.rating,
      review: dto.review,
    });

    await this.ratingRepo.save(rating);

    await this.updateLawyerStats(legalCase.lawyer.id);

    return rating;
  }

  async updateLawyerStats(lawyerId: string) {
    const ratings = await this.ratingRepo.find({
      where: { lawyer: { id: lawyerId } },
    });

    const lawyer = await this.lawyerRepo.findOne({
      where: { id: lawyerId },
    });

    if (!lawyer) return;

    const totalRatings = ratings.length;

    const avg =
      ratings.reduce((sum, r) => sum + r.rating, 0) / (totalRatings || 1);

    lawyer.ratingAvg = Number(avg.toFixed(2));
    lawyer.totalCasesHandled = totalRatings;

    lawyer.trustScore =
      0.5 * lawyer.ratingAvg +
      0.3 * lawyer.completionRate +
      0.2 * lawyer.responseTimeScore;

    await this.lawyerRepo.save(lawyer);
  }

  async getLawyerRatings(lawyerId: string, page = 1, limit = 10) {
    const [data, total] = await this.ratingRepo.findAndCount({
      where: { lawyer: { id: lawyerId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      total,
      page,
      limit,
      data,
    };
  }
}
