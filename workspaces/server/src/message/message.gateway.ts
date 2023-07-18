import { Logger, UsePipes } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { WsValidationPipe } from 'src/websocket/ws.validation-pipe';

@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('MessageGateway');

  @WebSocketServer() wss: Server;

  constructor(private messageService: MessageService) {}

  afterInit(server: Server) {
    // this.messageService.server = server;

    this.logger.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    // this.messageService.initializeSocket(client as any);

    this.logger.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    // this.messageService.terminateSocket(client as any);
    this.logger.log('Client disconnected: ' + client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    this.logger.log('OVERHERE', payload);

    const newMessage = await this.messageService.createMessage(payload);
    this.wss.emit('receiveMessage', newMessage);
  }
}
