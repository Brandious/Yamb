import { Dices } from "./Dices";

export type DiceStateDefinition = {
  dices: Dices[] | null;
  rolls: number;
  round: number;
  scores: Map<string, number>;
  owner: string | null;
};
