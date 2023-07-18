import { Server } from 'socket.io';
import { Lobby } from './lobby';
import { AuthenticatedSocket } from '../../websocket/types';
import { LobbyMode } from './types';
import { Cron } from '@nestjs/schedule';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';
import { LOBBY_MAX_LIFETIME, MAX_CLIENTS } from '../../constants';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerException } from '../server.exception';
import { SocketExceptions } from '../../../../shared/server/SocketExceptions';
export class LobbyManager {
  public server: Server;

  private readonly lobbies = new Map<Lobby['id'], Lobby>();

  public initializeSocket(client: AuthenticatedSocket) {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket) {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(mode: LobbyMode, delayBetweenRounds: number) {
    let maxClients = MAX_CLIENTS;

    switch (mode) {
      case 'solo':
        maxClients = 1;
        break;
      case 'multiple':
        maxClients = 6;
    }

    const lobby = new Lobby(this.server, maxClients);

    lobby.instance.delayBetweenRounds = delayBetweenRounds;
    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket) {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      throw new ServerException(
        SocketExceptions.LOBBY_NOT_FOUND,
        'Lobby not found',
      );
    }

    lobby.addClient(client);
  }

  @Cron('*/5 * * * * *')
  private lobbiesCleaner() {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
          ServerEvents.GAME_MESSAGE,
          {
            color: 'blue',
            message: 'Game time out',
          },
        );

        lobby.instance.triggerFinish();
        this.lobbies.delete(lobbyId);
      }
    }
  }
}
