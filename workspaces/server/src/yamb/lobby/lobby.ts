import { Socket, Server } from 'socket.io';
import { AuthenticatedSocket } from './../../websocket/types';

import { v4 } from 'uuid';
import { Instance } from '../instance/instance';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';
import { ServerEvents } from '../../../../shared/server/ServerEvents';

export interface MapType {
  key: string;
  value: number;
}

export class Lobby {
  public readonly id: string = v4();
  public readonly createdAt: Date = new Date();

  public clients: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();

  public readonly instance: Instance = new Instance(this);

  constructor(
    private readonly server: Server,
    public readonly maxClients: number,
  ) {}

  public addClient(client: AuthenticatedSocket) {
    this.clients.set(client.id, client);

    client.join(this.id);
    client.data.lobby = this;

    if (this.clients.size >= this.maxClients) {
      this.instance.triggerStart();
    }

    this.dispatchLobbyState(client);
  }

  public removeClient(client: AuthenticatedSocket) {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    this.instance.triggerFinish(client, client.id);

    this.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
      ServerEvents.GAME_MESSAGE,
      {
        color: 'blue',
        message: 'Opponent left lobby',
      },
    );

    this.dispatchLobbyState(client);
  }

  private mapToArray(map: Map<Socket['id'], number>): MapType[] {
    const array: MapType[] = [];

    map.forEach((value, key) => {
      array.push({ key, value });
    });

    return array;
  }

  public dispatchLobbyState(client: AuthenticatedSocket): void {
    const payload: ServerPayloads[ServerEvents.LOBBY_STATE] = {
      lobbyId: this.id,
      mode: this.maxClients === 1 ? 'solo' : 'multiple',
      delayBetweenRounds: this.instance.delayBetweenRounds,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      currentRound: this.instance.currentRound,
      playersCount: this.clients.size,
      dices: this.instance.dices.toDefinition(client) || null,
      isSuspended: this.instance.isSuspended,
      scores: this.mapToArray(this.instance.scores),
      clientsReady: this.instance.readyClients,
    };

    this.dispatchToLobby(ServerEvents.LOBBY_STATE, payload, client.id);
  }

  public dispatchToLobby<T>(
    event: ServerEvents,
    data: T,
    client: string = this.id,
  ): void {
    this.server.to(client).emit(event, data);
  }
}
