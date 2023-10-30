import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post()
  create(@Body() body) {
    return this.messageService.create(body);
    return 1;
  }
}
