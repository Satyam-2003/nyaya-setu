import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { LawyersService } from './lawyers.service';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { UpdateLawyerDto } from './dto/update-lawyer.dto';
import { FilterLawyerDto } from './dto/filter-lawyer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('lawyers')
export class LawyersController {
  constructor(private lawyersService: LawyersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('lawyer')
  @Post()
  create(@GetUser() user: any, @Body() dto: CreateLawyerDto) {
    return this.lawyersService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('lawyer')
  @Patch()
  update(@GetUser() user: any, @Body() dto: UpdateLawyerDto) {
    return this.lawyersService.update(user.id, dto);
  }

  @Get()
  findAll(@Query() filter: FilterLawyerDto) {
    return this.lawyersService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lawyersService.findOne(id);
  }
}
