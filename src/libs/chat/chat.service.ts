import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    public readonly ChatRepository: Repository<Chat>,
    private readonly chatGateway: ChatGateway,
  ) {}

  sendMessage(body: any) {
    console.log('sendMessage', body);
  }
}
