import { Socket } from 'socket.io';
import { Dices } from '../../../../shared/common/Dices';
import { DiceStateDefinition } from '../../../../shared/common/types';

export class DiceState {
  constructor(
    public readonly dice: Dices,
    public isRevealed = false,
    public isLocked = false,
    public ownerId: Socket['id'] | null = null,
  ) {}

  public toDefinition(): DiceStateDefinition {
    return {
      dices: this.isRevealed ? this.dice : null,
      owner: this.ownerId,
    };
  }
}
