import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import * as qs from 'qs';
import * as jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '@/constant/config';
import { Logger } from '@nestjs/common';
interface MessageType {
  type: 'chat' | 'event' | 'status';
  payload: any;
}
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket, ...args: any[]): void {
    Logger.log('客户端已连接', 'ChatGateway');
    const clientConnectUrl: string = args[0].url;
    const { token } = qs.parse(clientConnectUrl.split('?')[1]);

    jwt.verify(token as string, PRIVATE_KEY, (err) => {
      if (err) {
        client.send(this.toMessage('event', 'The token authentication failed'));
        client.close();
      } else {
        client.send(
          this.toMessage('event', 'The token authentication success'),
        );
        client.on('message', (message) => {
          const messageString = message.toString();
          const data: MessageType = JSON.parse(messageString || '{}');
          if (data?.type) {
            switch (data.type) {
              case 'chat':
                this.handleChatMessage(data.payload || '');
            }
          }
        });
      }
    });
  }

  handleChatMessage(message: any) {
    console.log('handleChatMessage', message);
  }

  handleDisconnect(client: WebSocket): void {
    // 当客户端断开连接时触发
    Logger.log('客户端已断开', 'ChatGateway');
  }

  // 转换消息为字符串
  toMessage(type: MessageType['type'], payload: MessageType['payload']) {
    return JSON.stringify({
      type,
      payload,
    } as MessageType);
  }
}
