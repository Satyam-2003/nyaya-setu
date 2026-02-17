import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lawyer } from 'src/database/postgres/entities/lawyer.entity';
import { LawyersService } from './lawyers.service';
import { LawyersController } from './lawyers.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lawyer]), UsersModule],
  controllers: [LawyersController],
  providers: [LawyersService],
})
export class LawyersModule {}
