import { Socket } from 'socket.io';
import { DiceState } from './dice-state';
import { ServerEvents } from '../../../../shared/server/ServerEvents';
import { ServerPayloads } from '../../../../shared/server/ServerPayloads';
import { SECOND } from '../../constants';

import { Lobby } from '../lobby/lobby';

export class Instance {
  public hasStarted = false;
  public hasFinished = false;
  public isSuspended = false;

  public currentRound = 1;
  public dices: DiceState[] = [];
  public scores: Record<Socket['id'], number> = {};

  public delayBetweenRounds = 2;

  public numberOfRolesForCurrentRound: Record<number, Socket['id']> = {};

  constructor(private readonly lobby: Lobby) {
    this.initializeDices();
  }

  public triggerStart() {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GAME_MESSAGE]>(
      ServerEvents.GAME_MESSAGE,
      {
        color: 'blue',
        message: 'Game started',
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
    const dices = [];

    this.dices = dices;
  }
}
