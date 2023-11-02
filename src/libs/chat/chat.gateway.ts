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
import { Chat } from './chat.entity';
import { User } from '../user/user.entity';
interface MessageType {
  type: 'chat' | 'event' | 'status';
  payload: any;
}
interface CustomWebSocket extends WebSocket {
  userId: string;
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private users = new Map<string, WebSocket>();

  handleConnection(client: CustomWebSocket, req: any): void {
    Logger.log('客户端已连接', 'ChatGateway');
    const clientConnectUrl: string = req.url;
    const { token } = qs.parse(clientConnectUrl.split('?')[1]);
    this.verifyToken(client, token as string).then((decoded: User) => {
      this.users.set(decoded.id, client);
      client.userId = decoded.id;
      console.log(`用户${decoded.id}已连接`);
      client.send(this.toMessage('event', 'The token authentication success'));
      client.on('message', (message) => {
        const messageString = message.toString();
        const data: MessageType = JSON.parse(messageString || '{}');
        if (data?.type) {
          switch (data.type) {
            case 'chat': {
              const payload = data.payload as Chat;
              this.server.clients.forEach((client: CustomWebSocket) => {
                if (payload.receiver_id === client.userId) {
                  client.send(this.toMessage('chat', payload));
                }
              });
              this.handleChatMessage(data.payload || '');
            }
          }
        }
      });
    });
  }

  handleChatMessage(message: any) {
    console.log('handleChatMessage', message);
  }

  handleDisconnect(client: CustomWebSocket): void {
    // 当客户端断开连接时触发
    Logger.log('客户端已断开', 'ChatGateway');
    this.users.delete(client.userId);
  }

  // 转换消息为字符串
  toMessage(type: MessageType['type'], payload: MessageType['payload']) {
    return JSON.stringify({
      type,
      payload,
    } as MessageType);
  }
  // 鉴权token
  verifyToken(client, token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token as string, PRIVATE_KEY, (err, decoded: User) => {
        if (err) {
          reject(err);
          client.send(
            this.toMessage('event', 'The token authentication failed'),
          );
          client.close();
        } else {
          resolve(decoded);
        }
      });
    });
  }
}