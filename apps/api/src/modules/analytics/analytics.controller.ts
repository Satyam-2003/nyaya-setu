import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('platform')
  getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }

  @Get('top-lawyers')
  getTopLawyers(@Query('limit') limit: number) {
    return this.analyticsService.getTopLawyers(limit || 5);
  }

  @Get('monthly-revenue')
  getMonthlyRevenue() {
    return this.analyticsService.getMonthlyRevenue();
  }

  @Get('active-cases')
  getActiveCases() {
    return this.analyticsService.getActiveCases();
  }
}
