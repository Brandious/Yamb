import { Dices } from "./Dices";

export type DiceStateDefinition = {
  dices: Dices | null;
  owner: string | null;
};
