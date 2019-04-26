export const ragstoriches = {
  key: 'ragstoriches',
  play(game) {
    return game.nextTurn();
  }
};

export const visitseoul = {
  key: 'visitseoul',
  play(game) {
    return game.nextTurn();
  }
};

export const backward1 = {
  key: 'backward1',
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
  key: 'forward2',
  play(game) {
    return game.nextTurn();
  }
};

export const starcity = {
  key: 'starcity',
  play(game) {
    return game.nextTurn();
  }
};

export const reducetolls = {
  key: 'reducetolls',
  play(game) {
    return game.nextTurn();
  }
};

export const halvetolls = {
  key: 'halvetolls',
  play(game) {
    return game.nextTurn();
  }
};

export const doubletolls = {
  key: 'doubletolls',
  play(game) {
    return game.nextTurn();
  }
};

export const triplesantorini = {
  key: 'triplesantorini',
  play(game) {
    return game.nextTurn();
  }
};

export const attractinvestments = {
  key: 'attractinvestments',
  play(game) {
    return game.nextTurn();
  }
};

export const taxoffice = {
  key: 'taxoffice',
  play(game) {
    return game.nextTurn();
  }
};

export const donate = {
  key: 'donate',
  play(game) {
    return game.nextTurn();
  }
};

export const downgrade = {
  key: 'downgrade',
  play(game) {
    return game.nextTurn();
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

Chances.byKey = Chances.all.reduce((map, chance) => { map[chance.key] = chance;
                                                      return map; }, {});
