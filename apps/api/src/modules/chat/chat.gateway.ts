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

    return savedMessage;
  }
}
