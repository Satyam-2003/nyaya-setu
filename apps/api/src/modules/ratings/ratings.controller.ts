import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post()
  create(@GetUser() user: any, @Body() dto: CreateRatingDto) {
    return this.ratingsService.create(user.id, dto);
  }

  @Get('lawyer/:lawyerId')
  getLawyerRatings(
    @Param('lawyerId') lawyerId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.ratingsService.getLawyerRatings(lawyerId, page, limit);
  }
}
