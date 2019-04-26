export const Move = {
  apply: (move) => {
    switch (move.uci) {
    case "buy":
      return Buy(move.type);
    case "nobuy":
      return Nobuyland;
    case "roll":
      return Roll;
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

export function Roll() {
  return {
    uci: 'roll',
    dice1: Math.ceil(Math.random() * 6),
    dice2: Math.ceil(Math.random() * 6)
  };
};

export function RollWith(dice1, dice2) {
  return {
    uci: 'roll',
    dice1: dice1,
    dice2: dice2
  };
};

