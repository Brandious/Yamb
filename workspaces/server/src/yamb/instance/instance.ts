import { Socket } from 'socket.io';
import { DiceState } from './dice-state';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';
import { SECOND } from '../../constants';

import { Lobby } from '../lobby/lobby';
import { NUMBER_OF_ROUNDS } from '../../../../shared/common/Dices';
import { AuthenticatedSocket } from '@app/websocket/types';

export class Instance {
  public hasStarted = false;
  public hasFinished = false;
  public isSuspended = false;
  public readyClients = 0;
  public roles = 0;
  public currentRound = 1;
  public dices: DiceState = new DiceState();
  public clientReadyMap: Map<Socket['id'], boolean> = new Map();
  public scores: Map<Socket['id'], number> = new Map();

  public delayBetweenRounds = 2;

  public numberOfRolesForCurrentRound: Record<number, Socket['id']> = {};

  constructor(private readonly lobby: Lobby) {}

  public clientReady(client: AuthenticatedSocket) {
    this.readyClients++;

    this.clientReadyMap.set(client.id, true);
    this.dices.initializeDices(client);
    this.hasStarted = true;

    this.lobby.dispatchLobbyState(client);
  }

  public triggerStart() {
    if (this.hasStarted) {
      return;
    }

    if (this.lobby.clients.size < this.readyClients) {
      this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
        ServerEvents.GAME_MESSAGE,
        {
          color: 'red',
          message: 'Not all players are ready',
        },
      );
    }

    this.hasStarted = true;

    // this.lobby.clients.forEach((client) => {
    //   this.dices.initializeDices(client);
    // });

    this.triggerRoundStart();
  }

  public triggerRoundStart() {
    console.log('Round started');

    this.lobby.clients.forEach((client) => {
      const diceState = this.dices.diceState.get(client.id);

      if (!diceState) return;

      diceState.rolls = 0;
      diceState.round = this.currentRound;
      diceState.dices = [];
      diceState.holds = [false, false, false, false, false];
      diceState.owner = client.id;
    });

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
      ServerEvents.GAME_MESSAGE,
      {
        color: 'blue',
        message: 'Round started',
      },
    );
  }

  public triggerFinish(client: AuthenticatedSocket, clientId: string) {
    if (this.hasFinished || !this.hasStarted) return;

    const diceState = this.dices.diceState.get(clientId);

    if (diceState?.round === NUMBER_OF_ROUNDS) {
      this.hasFinished = true;
      this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
        ServerEvents.GAME_MESSAGE,
        {
          color: 'blue',
          message: 'Game finished',
        },
      );
    }

    this.lobby.dispatchLobbyState(client);
  }

  //TODO: Hold Support missing
  public rollDices(
    client: AuthenticatedSocket,
    clientId: string,
    holdDice: any,
  ) {
    console.log('Rolling dices');

    if (!this.dices) throw 'Something is wrong';

    this.dices.roll(clientId, holdDice);

    if (this.dices.getRollCount(clientId))
      return this.addScore(client, clientId);

    this.lobby.dispatchLobbyState(client);
  }

  public addScore(client: AuthenticatedSocket, clientId: string) {
    this.isSuspended = true;

    this.dices.calculateScores(clientId);

    this.lobby.dispatchLobbyState(client);

    // this.transitionToNextRound(client, clientId);
  }

  public transitionToNextRound(
    client: AuthenticatedSocket,
    clientId: string,
    data: any,
  ) {
    const diceState = this.dices.diceState.get(clientId);

    if (!diceState) throw "Can't transitionToNextRound";

    setTimeout(() => {
      this.isSuspended = false;

      this.numberOfRolesForCurrentRound = {};
      this.dices.setResults(clientId, data);

      this.scores.set(
        clientId,
        diceState.results.reduce((a, b) => a + b, 0),
      );

      if (this.currentRound === NUMBER_OF_ROUNDS) {
        this.triggerFinish(client, clientId);
      }

      this.lobby.dispatchLobbyState(client);
    }, this.delayBetweenRounds * SECOND);
  }
}
