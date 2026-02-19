import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { AssignLawyerDto } from './dto/assign-lawyer.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post()
  create(@GetUser() user: any, @Body() dto: CreateCaseDto) {
    return this.casesService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignLawyerDto) {
    return this.casesService.assign(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.casesService.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.casesService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }
}
