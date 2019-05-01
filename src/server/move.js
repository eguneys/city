import { Chances } from './chance';

export const Move = {
  apply: (move) => {
    switch (move.uci) {
    case "buy":
      return Buy(move.type);
    case "nobuy":
      return Nobuyland;
    case "roll":
      return Roll();
    case "sell":
      return Sell(move.cities);
    }
    return null;
  }
};

export function Buy(type) {
  return {
    uci: 'buy',
    type
  };
}

export const Nobuyland = {
  uci: 'nobuyland'
};

export function Sell(cities) {
  return {
    uci: 'sell',
    cities
  };
}

const withRolls = function(arr) {
  var i = 0;
  return () => {
    return arr[(i++)%arr.length];
  };
};

const rollTest1 = withRolls([1, 2, 3, 12, 5, 12]);
const rollTest2 = withRolls([1, 2, 3, 2]);
const rollTest3 = withRolls([1, 4, 3, 12]);
const rollTest4 = withRolls([1]);
const rollTest5 = withRolls([1, 4, 1, 1, 2, 20, 1, 1]);
const rollTest6 = withRolls([1, 10, 2, 1]);

const rollTest7 = withRolls([1, 4, 9, 1, 1, 5, 18]);
const rollTest8 = withRolls([1, 12, 1]);

const rollTest9 = withRolls([4, 1, 1, 1, 2, 2]);

export function Roll() {
  return {
    uci: 'roll',
    dice1: 1,
    dice2: Math.ceil(Math.random() * 2),
    // dice1: Math.ceil(Math.random() * 6),
    // dice2: Math.ceil(Math.random() * 6),
    chance: Chances.random()

  };
};

export function RollWith(dice1, dice2, chance) {
  return {
    uci: 'roll',
    dice1: dice1,
    dice2: dice2,
    chance: Chances.byKey[chance]
  };
};

