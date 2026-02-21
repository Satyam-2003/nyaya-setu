import { NotificationType } from '../../../database/postgres/entities/notification.entity';

export class CreateNotificationDto {
  recipientId!: string;
  title!: string;
  message!: string;
  type!: NotificationType;
}