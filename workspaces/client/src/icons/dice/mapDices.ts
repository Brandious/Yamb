import { Dices } from "@yamb/shared/common/Dices";

import { One, Two, Three, Four, Five, Six } from "./diceImages";

export const DiceMap = (dice: Dices | null) => {
  switch (dice) {
    case Dices.One:
      return One;
    case Dices.Two:
      return Two;
    case Dices.Three:
      return Three;
    case Dices.Four:
      return Four;
    case Dices.Five:
      return Five;
    case Dices.Six:
      return Six;
    default:
      return null;
  }
};
