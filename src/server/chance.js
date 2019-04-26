export const ragstoriches = {
  play(game) {
    nextTurn(game);
  }
};

export const visitseoul = {
  play(game) {
    nextTurn(game);
  }
};

export const backward1 = {
  play(game) {
    const player = game.players[game.turnColor];
    player.currentTile = player.currentTile - 1;
    game.events.push({ chance: 'backward1' });
    game.events.push({ move: -1 });
    game.playOnLandTile(game);
    return game;
  }
};

export const forward2 = {
  play(game) {
    nextTurn(game);
  }
};

export const starcity = {
  play(game) {
    nextTurn(game);
  }
};

export const reducetolls = {
  play(game) {
    nextTurn(game);
  }
};

export const halvetolls = {
  play(game) {
    nextTurn(game);
  }
};

export const doubletolls = {
  play(game) {
    nextTurn(game);
  }
};

export const triplesantorini = {
  play(game) {
    nextTurn(game);
  }
};

export const attractinvestments = {
  play(game) {
    nextTurn(game);
  }
};

export const taxoffice = {
  play(game) {
    nextTurn(game);
  }
};

export const donate = {
  play(game) {
    nextTurn(game);
  }
};

export const downgrade = {
  play(game) {
    nextTurn(game);
  }
};

export const Chances = {
  all: [
    ragstoriches,
    visitseoul,
    backward1,
    forward2,
    starcity,
    reducetolls,
    halvetolls,
    doubletolls,
    triplesantorini,
    attractinvestments,
    taxoffice,
    donate,
    downgrade
  ]
};

