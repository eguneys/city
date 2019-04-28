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
    }
    return null;
  }
};

export function Buy(type) {
  return {
    uci: 'buy',
    type: type
  };
}

export const Nobuyland = {
  uci: 'nobuyland'
};

const withRolls = function(arr) {
  var i = 0;
  return () => {
    return arr[(i++)%arr.length];
  };
};

const rollTest1 = withRolls([1, 2, 3, 12, 5, 12]);

export function Roll() {
  return {
    uci: 'roll',
    dice1: rollTest1(),//Math.ceil(Math.random() * 6),
    dice2: 0,//Math.ceil(Math.random() * 6),
    chance: Chances.all[Math.floor(Math.random() * Chances.all.length)]

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

