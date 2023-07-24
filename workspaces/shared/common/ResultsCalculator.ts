import { Results, Dices } from "../common/Dices";

export const results = new Map<Results, number>([
  [Results.Ones, 0],
  [Results.Twos, 0],
  [Results.Threes, 0],
  [Results.Fours, 0],
  [Results.Fives, 0],
  [Results.Sixes, 0],
  [Results.Sum, 0],
  [Results.Bonus, 0],
  [Results.OnePair, 0],
  [Results.TwoPairs, 0],
  [Results.ThreeOfAKind, 0],
  [Results.FourOfAKind, 0],
  [Results.SmallStraight, 0],
  [Results.LargeStraight, 0],
  [Results.FullHouse, 0],
  [Results.Chance, 0],
  [Results.Yamb, 0],
]);

export function calculateIndividualResults(dices: Dices[], category: number) {
  if (!dices) return 0;
  return dices.reduce((acc, curr) => {
    if (curr === category) {
      return acc + curr;
    }
    return acc;
  }, 0);
}

export function calculateOnePair(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => b - a);
  for (let i = 0; i < sortedDices.length - 1; i++) {
    if (sortedDices[i] === sortedDices[i + 1]) {
      return sortedDices[i] * 2;
    }
  }
  return 0;
}

export function calculateTwoPairs(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => b - a);
  let firstPair = 0;
  let secondPair = 0;
  for (let i = 0; i < sortedDices.length - 1; i++) {
    if (sortedDices[i] === sortedDices[i + 1]) {
      if (firstPair === 0) {
        firstPair = sortedDices[i] * 2;
      } else {
        secondPair = sortedDices[i] * 2;
      }
    }
  }
  return firstPair + secondPair;
}

export function calculateThreeOfAKind(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => b - a);
  for (let i = 0; i < sortedDices.length - 2; i++) {
    if (
      sortedDices[i] === sortedDices[i + 1] &&
      sortedDices[i] === sortedDices[i + 2]
    ) {
      return sortedDices[i] * 3;
    }
  }
  return 0;
}

export function calculateFourOfAKind(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => b - a);
  for (let i = 0; i < sortedDices.length - 3; i++) {
    if (
      sortedDices[i] === sortedDices[i + 1] &&
      sortedDices[i] === sortedDices[i + 2] &&
      sortedDices[i] === sortedDices[i + 3]
    ) {
      return sortedDices[i] * 4;
    }
  }
  return 0;
}

export function calculateSmallStraight(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => a - b);
  const smallStraight = [1, 2, 3, 4, 5];
  const isSmallStraight = sortedDices.every(
    (dice, index) => dice === smallStraight[index]
  );
  return isSmallStraight ? 30 : 0;
}

export function calculateLargeStraight(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => a - b);
  const largeStraight = [2, 3, 4, 5, 6];
  const isLargeStraight = sortedDices.every(
    (dice, index) => dice === largeStraight[index]
  );
  return isLargeStraight ? 40 : 0;
}

export function calculateFullHouse(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => b - a);
  let threeOfAKind = 0;
  let twoOfAKind = 0;
  for (let i = 0; i < sortedDices.length - 2; i++) {
    if (
      sortedDices[i] === sortedDices[i + 1] &&
      sortedDices[i] === sortedDices[i + 2]
    ) {
      threeOfAKind = sortedDices[i] * 3;
    }
  }
  for (let i = 0; i < sortedDices.length - 1; i++) {
    if (sortedDices[i] === sortedDices[i + 1]) {
      twoOfAKind = sortedDices[i] * 2;
    }
  }
  return threeOfAKind && twoOfAKind ? threeOfAKind + twoOfAKind : 0;
}

export function calculateChance(dices: Dices[]) {
  return [...dices].slice(0, 5).reduce((acc, curr) => acc + curr, 0);
}

export function calculateYamb(dices: Dices[]) {
  const sortedDices = [...dices].sort((a, b) => b - a);
  const isYamb = sortedDices.every((dice) => dice === sortedDices[0]);
  return isYamb ? 50 : 0;
}

export function calculateResults(dices: Dices[]) {
  if (!dices) return;

  [1, 2, 3, 4, 5, 6].forEach((dice) => {
    results.set(dice as Results, calculateIndividualResults(dices, dice));
  });

  results.set(
    Results.Sum,
    [...dices].slice(0, 6).reduce((acc, curr) => acc + curr, 0)
  );

  results.set(Results.Bonus, results.get(Results.Sum)! >= 63 ? 35 : 0);

  results.set(Results.OnePair, calculateOnePair(dices));
  results.set(Results.TwoPairs, calculateTwoPairs(dices));
  results.set(Results.ThreeOfAKind, calculateThreeOfAKind(dices));
  results.set(Results.FourOfAKind, calculateFourOfAKind(dices));
  results.set(Results.SmallStraight, calculateSmallStraight(dices));
  results.set(Results.LargeStraight, calculateLargeStraight(dices));
  results.set(Results.FullHouse, calculateFullHouse(dices));
  results.set(Results.Chance, calculateChance(dices));
  results.set(Results.Yamb, calculateYamb(dices));

  // results.set(Results.Total, calculateTotal(results));

  return results;
}
