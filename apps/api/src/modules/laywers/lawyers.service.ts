import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lawyer } from 'src/database/postgres/entities/lawyer.entity';
import { UsersService } from '../users/users.service';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { UpdateLawyerDto } from './dto/update-lawyer.dto';
import { FilterLawyerDto } from './dto/filter-lawyer.dto';
import { UserRole } from 'src/database/postgres/entities/user.entity';

@Injectable()
export class LawyersService {
  constructor(
    @InjectRepository(Lawyer)
    private lawyerRepository: Repository<Lawyer>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateLawyerDto) {
    const user = await this.usersService.findById(userId);

    if (!user || user.role !== UserRole.LAWYER) {
      throw new ForbiddenException('Only lawyers can create profile');
    }

    const lawyer = this.lawyerRepository.create({
      user,
      ...dto,
    });

    return this.lawyerRepository.save(lawyer);
  }

  async update(userId: string, dto: UpdateLawyerDto) {
    const lawyer = await this.lawyerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!lawyer) throw new NotFoundException('Lawyer profile not found');

    Object.assign(lawyer, dto);

    return this.lawyerRepository.save(lawyer);
  }

  async findAll(filter: FilterLawyerDto) {
    const page = filter.page || 1;
    const limit = filter.limit || 10;

    const query = this.lawyerRepository
      .createQueryBuilder('lawyer')
      .leftJoinAndSelect('lawyer.user', 'user');

    if (filter.specialization) {
      query.andWhere('lawyer.specialization ILIKE :spec', {
        spec: `%${filter.specialization}%`,
      });
    }

    if (filter.location) {
      query.andWhere('lawyer.location ILIKE :loc', {
        loc: `%${filter.location}%`,
      });
    }

    if (filter.minExperience) {
      query.andWhere('lawyer.experienceYears >= :exp', {
        exp: filter.minExperience,
      });
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOne(id: string) {
    const lawyer = await this.lawyerRepository.findOne({
      where: { id },
    });

    if (!lawyer) throw new NotFoundException('Lawyer not found');

    return lawyer;
  }

  async updateTrustScore(lawyerId: string) {
    const lawyer = await this.findOne(lawyerId);

    lawyer.trustScore =
      0.5 * lawyer.ratingAvg +
      0.3 * lawyer.completionRate +
      0.2 * lawyer.responseTimeScore;

    return this.lawyerRepository.save(lawyer);
  }
}
