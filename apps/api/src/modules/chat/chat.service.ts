import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatMessage,
  ChatMessageDocument,
} from 'src/database/mongo/schemas/chat-message.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from 'src/database/postgres/entities/case.entity';

@Injectable()
export class ChatService{
  constructor(
    @InjectModel(ChatMessage.name)
    private chatModel: Model<ChatMessageDocument>,

    @InjectRepository(Case)
    private caseRepo: Repository<Case>,
  ) {}

  async validateCaseAccess(caseId: string, userId: string) {
    const legalCase = await this.caseRepo.findOne({
      where: { id: caseId },
    });

    if (!legalCase) throw new NotFoundException('Case not found');

    const isClient = legalCase.client.id === userId;
    const isLawyer =
      legalCase.lawyer && legalCase.lawyer.user.id === userId;

    if (!isClient && !isLawyer) {
      throw new ForbiddenException('Not allowed in this chat');
    }

    return legalCase;
  }

  async saveMessage(
    caseId: string,
    senderId: string,
    message: string,
  ) {
    return this.chatModel.create({
      caseId,
      senderId,
      message,
    });
  }

  async getMessages(caseId: string, page = 1, limit = 20) {
    const messages = await this.chatModel
      .find({ caseId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return messages;
  }
}
