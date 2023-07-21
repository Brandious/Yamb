import { Socket } from 'socket.io';
import { Dices } from '../../../../shared/common/Dices';
import { DiceStateDefinition } from '../../../../shared/common/types';

export class DiceState {
  constructor(
    public dice: Dices[],
    public rolls: number = 0,
    public round: number = 0,
    public scores: Map<string, number> = new Map(),
    public ownerId: Socket['id'] | null = null,
  ) {}

  public toDefinition(): DiceStateDefinition {
    return {
      dices: this.dice,
      rolls: this.rolls,
      round: this.round,
      scores: this.scores,
      owner: this.ownerId,
    };
  }
}
