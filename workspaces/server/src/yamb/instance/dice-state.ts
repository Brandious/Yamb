import { calculateResults } from '../../../../shared/common/ResultsCalculator';
import { Socket } from 'socket.io';
import {
  Dices,
  NUMBER_OF_ROLES,
  Results,
} from '../../../../shared/common/Dices';
import { DiceStateDefinition } from '@yamb/shared/common/types';
import { AuthenticatedSocket } from '@app/websocket/types';

export class DiceState {
  public diceState = new Map<Socket['id'], DiceStateDefinition>();

  public initializeDices(client: AuthenticatedSocket): void {
    this.diceState.set(client.id, {
      dices: [],
      holds: [false, false, false, false, false],
      rolls: 0,
      round: 1,
      scores: [],
      results: [],
      owner: client.id,
    });
  }

  public updateDices(client: AuthenticatedSocket, dices: Dices[]): void {
    const returnObj = this.diceState.get(client.id);

    if (returnObj) {
      returnObj.dices = dices;
    }
  }

  public roll(client: string, holdDice: any): void {
    const returnObj = this.diceState.get(client);

    if (!returnObj) throw 'ReturnObject is null';

    const array = returnObj?.dices?.length ? returnObj.dices : [1, 2, 3, 4, 5];

    if (returnObj) {
      returnObj.rolls++;
      returnObj.dices = array.map((el: any, index: number) =>
        holdDice[index] ? el : Math.floor(Math.random() * 6) + 1,
      );
    }
  }

  public getRollCount(client: string): boolean {
    const returnObj = this.diceState.get(client);

    if (!returnObj) throw 'ReturnObject is null';

    if (returnObj.rolls === NUMBER_OF_ROLES) {
      returnObj.rolls = 0;
      returnObj.round++;
      return true;
    }

    return false;
  }

  public calculateScores(client: string): void {
    const returnObj = this.diceState.get(client);
    if (!returnObj) throw 'ReturnObject is null';
    const dices = returnObj.dices;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const results = calculateResults(dices!)!;

    returnObj.scores = [...results.values()];

    if (!dices) throw 'Dices are null';
  }

  public setResults(clientId: string, data: any) {
    const returnObj = this.diceState.get(clientId);

    if (!returnObj) throw 'ReturnObject is null';

    returnObj.results[data.index] = data.result;
  }
  public toDefinition(
    client: AuthenticatedSocket | null,
  ): DiceStateDefinition | null {
    if (!client) throw "Client doesn't exist";

    const returnObj = this.diceState.get(client.id);

    if (!returnObj) return null;

    return {
      dices: returnObj.dices,
      holds: returnObj.holds,
      rolls: returnObj.rolls,
      round: returnObj.round,
      scores: returnObj.scores,
      results: returnObj.results,
      owner: returnObj.owner,
    };
  }
}
