import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case, CaseStatus } from 'src/database/postgres/entities/case.entity';
import { UsersService } from '../users/users.service';
import { LawyersService } from '../laywers/lawyers.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { AssignLawyerDto } from './dto/assign-lawyer.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UserRole } from 'src/database/postgres/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../database/postgres/entities/notification.entity';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    private usersService: UsersService,
    private lawyersService: LawyersService,
    private notificationsService: NotificationsService,
  ) {}

  // AI Classification Placeholder
  private classifyCase(description: string): string {
    if (description.toLowerCase().includes('rent')) return 'Rental Dispute';
    if (description.toLowerCase().includes('divorce')) return 'Family Law';
    return 'General Legal';
  }

  // case creation
  async create(clientId: string, dto: CreateCaseDto) {
    const client = await this.usersService.findById(clientId);

    if (!client || client.role !== UserRole.CLIENT) {
      throw new ForbiddenException('Only clients can create cases');
    }

    const category = this.classifyCase(dto.description);

    const newCase = this.caseRepository.create({
      ...dto,
      category,
      client,
    });
    return this.caseRepository.save(newCase);
  }

  // case assign to lawyer
  async assign(caseId: string, dto: AssignLawyerDto) {
    const legalCase = await this.caseRepository.findOne({
      where: { id: caseId },
    });

    if (!legalCase) throw new NotFoundException('Case not found');

    const lawyer = await this.lawyersService.findOne(dto.lawyerId);

    legalCase.lawyer = lawyer;
    legalCase.status = CaseStatus.ASSIGNED;

    await this.caseRepository.save(legalCase);

    await this.notificationsService.create({
      recipientId: lawyer.user.id,
      title: 'New Case Assigned',
      message: `You have been assigned to case: ${legalCase.title}`,
      type: NotificationType.CASE_ASSIGNED,
    });

    return legalCase;
  }

  // update the case status
  async updateStatus(caseId: string, dto: UpdateStatusDto) {
    const legalCase = await this.caseRepository.findOne({
      where: { id: caseId },
    });

    if (!legalCase) throw new NotFoundException('Case not found');

    legalCase.status = dto.status;

    return this.caseRepository.save(legalCase);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.caseRepository.findAndCount({
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

  async findOne(id: string) {
    const legalCase = await this.caseRepository.findOne({
      where: { id },
    });

    if (!legalCase) throw new NotFoundException('Case not found');

    return legalCase;
  }
}
