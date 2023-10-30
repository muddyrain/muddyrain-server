import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get('')
  handleHttpConnection() {
    // 处理 HTTP 请求
    return 'HTTP 请求已处理';
  }
}
