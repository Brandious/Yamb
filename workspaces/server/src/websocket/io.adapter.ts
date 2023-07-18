import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket } from 'socket.io';
import { CONNECTION_EVENT } from '@nestjs/websockets/constants';

export class ServerIoAdapter extends IoAdapter {
  private options = {
    cors: {
      origin: '*',
    },
    path: '/socket.io',
    transports: ['websocket'],
    serveClient: false,
    maxSocketListeners: 35,
  };

  createIOServer(port: number, options?: any): any {
    return super.createIOServer(port, { ...this.options, ...options });
  }

  public bindClientConnect(server: any, callback: any): void {
    server.on(CONNECTION_EVENT, (socket: Socket) => {
      socket.setMaxListeners(this.options.maxSocketListeners);
      callback(socket);
    });
  }
}
