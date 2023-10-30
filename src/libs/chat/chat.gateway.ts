import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('新连接已建立');
  }

  handleDisconnect(client: any) {
    console.log('连接已断开');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('接收到消息：', payload);
  }
}
