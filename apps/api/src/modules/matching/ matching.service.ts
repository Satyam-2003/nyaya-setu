import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lawyer } from 'src/database/postgres/entities/lawyer.entity';
import { Case, CaseStatus } from 'src/database/postgres/entities/case.entity';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Lawyer)
    private lawyerRepo: Repository<Lawyer>,

    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
  ) {}

  private normalize(value: number, max: number) {
    return max === 0 ? 0 : value / max;
  }
  async matchCase(caseId: string, autoAssign = false) {
    const legalCase = await this.caseRepo.findOne({
      where: { id: caseId },
    });

    if (!legalCase) throw new NotFoundException('Case not found');

    const lawyers = await this.lawyerRepo.find();

    if (!lawyers.length) return [];

    const maxExperience = Math.max(...lawyers.map((l) => l.experienceYears));

    const maxTrust = Math.max(...lawyers.map((l) => l.trustScore));

    const scoredLawyers = lawyers.map((lawyer) => {
      const specializationMatch = lawyer.specialization
        .toLowerCase()
        .includes(legalCase.category.toLowerCase())
        ? 1
        : 0;

      const ratingNormalized = this.normalize(lawyer.ratingAvg, 5);

      const experienceNormalized = this.normalize(
        lawyer.experienceYears,
        maxExperience,
      );

      const trustNormalized = this.normalize(lawyer.trustScore, maxTrust);

      const locationMatch = lawyer.location.toLowerCase().includes('india') // you can later improve with geo logic
        ? 1
        : 0;

      const score =
        0.3 * specializationMatch +
        0.25 * ratingNormalized +
        0.2 * experienceNormalized +
        0.15 * trustNormalized +
        0.1 * locationMatch;

      return {
        lawyer,
        score: Number(score.toFixed(3)),
      };
    });

    scoredLawyers.sort((a, b) => b.score - a.score);

    if (autoAssign && scoredLawyers.length > 0) {
      legalCase.lawyer = scoredLawyers[0].lawyer;
      legalCase.status = CaseStatus.ASSIGNED;
      await this.caseRepo.save(legalCase);
    }

    return scoredLawyers;
  }
}
