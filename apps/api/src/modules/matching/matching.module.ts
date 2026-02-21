import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lawyer } from '../../database/postgres/entities/lawyer.entity';
import { Case } from '../../database/postgres/entities/case.entity';
import { MatchingService } from './ matching.service';
import { MatchingController } from './matching.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lawyer, Case]),
  ],
  providers: [MatchingService],
  controllers: [MatchingController],
})
export class MatchingModule {}