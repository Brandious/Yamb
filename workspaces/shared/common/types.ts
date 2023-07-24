import { Dices, Results } from "./Dices";

export type DiceStateDefinition = {
  dices: Dices[] | null;
  holds: boolean[];
  rolls: number;
  round: number;
  scores: number[];
  results: number[];
  owner: string | null;
};
