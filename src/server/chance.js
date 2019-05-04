import { Tiles, nextColor } from './state';

function moveCurrentTile(game, by) {
  const player = game.players[game.turnColor];
  player.currentTile = player.currentTile + by;
  game.events.push({ move: by });
  game.playOnLandTile(game);
  return game;  
}

export const ragstoriches = {
  key: 'ragstoriches',
  play(game) {
    const tmp = game.players['player1'].cash;

    game.players['player1'].cash = game.players['player2'].cash;
    game.players['player2'].cash = tmp;

    game.events.push({ rags: true });

    return game.nextTurn();
  }
};

export const visitseoul = {
  key: 'visitseoul',
  play(game) {
    const currentTile = game.players[game.turnColor].currentTile;
    const seoulTile = Tiles.findIndex(tile => tile.key === 'seoul');
    const by = (Tiles.length - currentTile + seoulTile) % Tiles.length;
    return moveCurrentTile(game, by);
  }
};

export const backward1 = {
  key: 'backward1',
  play(game) {
    return moveCurrentTile(game, -1);
  }
};

export const forward2 = {
  key: 'forward2',
  play(game) {
    return moveCurrentTile(game, 2);
  }
};

export const starcity = {
  key: 'starcity',
  play(game) {
    const cities = game.citiesOf(game.turnColor);

    if (cities.length > 0) {
      game.selectCities = cities;
      game.prompt = 'starcity';
      return game;
    } else {
      game.events.push({ nocity: true });
    }

    return game.nextTurn();
  }
};

export const reducetolls = {
  key: 'reducetolls',
  play(game) {
    const cities = game.citiesOf(nextColor(game.turnColor));

    if (cities.length > 0) {
      game.selectCities = cities;
      game.prompt = 'reducetolls';
      return game;
    } else {
      game.events.push({ nocity: true });
    }

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

Chances.random = () => Chances.all[Math.floor(Math.random() * Chances.all.length)];
