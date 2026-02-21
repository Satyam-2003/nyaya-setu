import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../database/postgres/entities/notification.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) return client.disconnect();

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (error) {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoin(
    @MessageBody() caseId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;

    await this.chatService.validateCaseAccess(caseId, userId);

    client.join(caseId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;

    await this.chatService.validateCaseAccess(dto.caseId, userId);

    const savedMessage = await this.chatService.saveMessage(
      dto.caseId,
      userId,
      dto.message,
    );

    this.server.to(dto.caseId).emit('newMessage', savedMessage);

    if (userId) {
      await this.notificationsService.create({
        recipientId: userId,
        title: 'New Chat Message',
        message: 'You have received a new message.',
        type: NotificationType.NEW_MESSAGE,
      });

      return savedMessage;
    }
  }
}
