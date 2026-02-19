import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatMessage,
  ChatMessageSchema,
} from '../../database/mongo/schemas/chat-message.schema';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from '../../database/postgres/entities/case.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
    TypeOrmModule.forFeature([Case]),
    JwtModule.register({}),
  ],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
