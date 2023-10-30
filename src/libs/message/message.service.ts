import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    public readonly messageRepository: Repository<Message>,
  ) {}
  create(body: Message) {
    const tmp = this.messageRepository.create(body);
    return this.messageRepository.save(tmp);
  }
}
