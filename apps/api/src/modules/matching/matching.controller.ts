import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MatchingService } from './ matching.service';
import { MatchCaseDto } from './dto/match-case.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('matching')
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  matchCase(@Body() dto: MatchCaseDto) {
    return this.matchingService.matchCase(
      dto.caseId,
      dto.autoAssign,
    );
  }
}