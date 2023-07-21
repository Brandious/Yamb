import { Socket } from 'socket.io';
import { DiceState } from './dice-state';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';
import { SECOND } from '../../constants';

import { Lobby } from '../lobby/lobby';
import { Dices } from '../../../../shared/common/Dices';

export class Instance {
  public hasStarted = false;
  public hasFinished = false;
  public isSuspended = false;
  public readyClients = 0;
  public roles = 0;
  public currentRound = 1;
  public dices: DiceState;
  public scores: Record<Socket['id'], number> = {};

  public delayBetweenRounds = 2;

  public numberOfRolesForCurrentRound: Record<number, Socket['id']> = {};

  constructor(private readonly lobby: Lobby) {
    this.initializeDices();
  }

  public clientReady() {
    this.readyClients++;
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
    this.triggerRoundStart();

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
      ServerEvents.GAME_MESSAGE,
      {
        color: 'blue',
        message: 'Game started',
      },
    );
  }

  public triggerRoundStart() {
    console.log('Round started');

    // create empty array of Dices
    const dices: Dices[] = [];
    // create new DiceState
    this.dices = new DiceState(dices, 0, 0, new Map(), null);
    // set roles to 0
    this.roles = 0;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
      ServerEvents.GAME_MESSAGE,
      {
        color: 'blue',
        message: 'Round started',
      },
    );
  }

  public triggerFinish() {
    if (this.hasFinished || !this.hasStarted) return;

    this.hasFinished = true;
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
      ServerEvents.GAME_MESSAGE,
      {
        color: 'blue',
        message: 'Game finished',
      },
    );
  }

  //   TODO: ADD LOGIC TO IT
  public rollDices() {
    console.log('Rolling dices');

    this.dices.dice = [
      Dices.One,
      Dices.Two,
      Dices.Three,
      Dices.Four,
      Dices.Five,
    ];
    this.dices.rolls++;
    console.log(this.dices);
    this.lobby.dispatchLobbyState();
  }

  public addScore() {
    console.log('Adding score');
    this.transitionToNextRound();
  }

  private transitionToNextRound() {
    this.isSuspended = true;

    setTimeout(() => {
      this.isSuspended = false;
      this.currentRound++;
      this.numberOfRolesForCurrentRound = {};

      //   const numberOfRoles = new Map<Dices, DiceState>();
    }, this.delayBetweenRounds * SECOND);

    console.log('Transitioning');
  }

  private initializeDices() {
    const dices: Dices[] = [];

    this.dices = new DiceState(dices, 0, 0, new Map(), null);
  }
}
