import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

interface MessageType {
  type: string;
  payload: any;
}
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket): void {
    // 当客户端连接时触发
    console.log('客户端连接进来');
    client.on('message', (message) => {
      const messageString = message.toString();
      const data: MessageType = JSON.parse(messageString || '{}');
      if (data?.type) {
        switch (data.type) {
          case 'chat':
            this.handleChatMessage(data.payload || '');
        }
      }

      // // 发送消息给客户端
      // this.server.clients.forEach((client) => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send('Hello from server!');
      //   }
      // });
    });
  }

  handleChatMessage(message: any) {
    console.log('handleChatMessage', message);
  }

  handleDisconnect(client: WebSocket): void {
    // 当客户端断开连接时触发
    console.log('Client disconnected:');
  }
}
