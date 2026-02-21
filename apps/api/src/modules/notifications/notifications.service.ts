import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../database/postgres/entities/notification.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private usersService: UsersService,
  ) {}

  async create(data: {
    recipientId: string;
    title: string;
    message: string;
    type: any;
  }) {
    const user = await this.usersService.findById(data.recipientId);

    if (!user) throw new NotFoundException('User not found');

    const notification = this.notificationRepo.create({
      recipient: user,
      title: data.title,
      message: data.message,
      type: data.type,
    });

    return this.notificationRepo.save(notification);
  }

  async findUserNotifications(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.notificationRepo.findAndCount({
      where: { recipient: { id: userId } },
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

  async markAsRead(notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    notification.isRead = true;

    return this.notificationRepo.save(notification);
  }
}
