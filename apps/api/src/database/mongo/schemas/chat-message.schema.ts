import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true })
  caseId!: string;

  @Prop({ required: true })
  senderId!: string;

  @Prop({ required: true })
  message!: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
