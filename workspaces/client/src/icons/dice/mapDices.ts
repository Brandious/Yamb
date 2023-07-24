import { Dices } from "@yamb/shared/common/Dices";

// import { One, Two, Three, Four, Five, Six } from "./diceImages";

import One from "./one.svg";
import Two from "./two.svg";
import Three from "./three.svg";

import Four from "./four.svg";
import Five from "./five.svg";
import Six from "./six.svg";

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
