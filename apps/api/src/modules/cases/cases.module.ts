import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from 'src/database/postgres/entities/case.entity';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { UsersModule } from '../users/users.module';
import { LawyersModule } from '../laywers/lawyers.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case]),
    UsersModule,
    LawyersModule,
    NotificationsModule,
  ],
  providers: [CasesService],
  controllers: [CasesController],
})
export class CasesModule {}
