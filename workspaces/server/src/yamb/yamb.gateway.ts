import { ServerPayloads } from './../../../shared/server/ServerPayloads';
// TODO: FIX IMPORT PATHS
import { ServerEvents } from '../../../shared/server/ServerEvents';
import { ClientEvents } from '../../../shared/client/ClientEvents';

import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { WsValidationPipe } from '../websocket/ws.validation-pipe';
import { Logger, UsePipes } from '@nestjs/common';

import { Socket, Server } from 'socket.io';
import { LobbyManager } from './lobby/lobby-manager';
import { AuthenticatedSocket } from '../websocket/types';
import { LobbyCreateDto, LobbyJoinDto } from './lobby/lobby.dto';

@UsePipes(new WsValidationPipe())
@WebSocketGateway()
export class YambGateway implements OnGatewayConnection {
  private readonly logger = new Logger(YambGateway.name);

  constructor(private readonly lobbyManager: LobbyManager) {}

  afterInit(server: Server): void {
    this.lobbyManager.server = server;
    this.logger.log('Game server started');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('OVERHERE', args);
    this.lobbyManager.initializeSocket(client as any);
    this.logger.log('Client connected: ' + client.id);
  }

  async handleDisconnect(client: Socket) {
    this.lobbyManager.terminateSocket(client as any);
    this.logger.log('Client disconnected: ' + client.id);
  }

  @SubscribeMessage(ClientEvents.CREATE_LOBBY)
  onLobbyCreate(
    client: AuthenticatedSocket,
    data: LobbyCreateDto,
  ): WsResponse<ServerPayloads[ServerEvents.GAME_MESSAGE]> {
    const lobby = this.lobbyManager.createLobby(
      data.mode,
      data.delayBetweenRounds,
    );

    lobby.addClient(client);

    return {
      event: ServerEvents.GAME_MESSAGE,
      data: {
        color: 'green',
        message: 'Lobby created',
      },
    };
  }

  @SubscribeMessage(ClientEvents.JOIN_LOBBY)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
    this.lobbyManager.joinLobby(data.lobbyId, client);
  }

  @SubscribeMessage(ClientEvents.LEAVE_LOBBY)
  onLobbyLeave(client: AuthenticatedSocket): void {
    client.data.lobby.removeClient(client);
  }

  // @SubscribeMessage(ClientEvents.START_GAME)
  // @SubscribeMessage(ClientEvents.START_TURN)
  // @SubscribeMessage(ClientEvents.ROLL_DICE)
  // @SubscribeMessage(ClientEvents.END_TURN)
  // @SubscribeMessage(ClientEvents.END_GAME)
}
