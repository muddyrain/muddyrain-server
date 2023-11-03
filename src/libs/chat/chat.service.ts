import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    public readonly ChatRepository: Repository<Chat>,
  ) {}

  async create(body: Chat) {
    await this.ChatRepository.create(body);
    const chat = await this.ChatRepository.save(body);
    return chat;
  }
}
