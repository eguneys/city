const ragstoriches = {
  play(game) {
    nextTurn(game);
  }
};

const visitseoul = {
  play(game) {
    nextTurn(game);
  }
};

const backward1 = {
  play(game) {
    const player = game.players[game.turnColor];
    player.currentTile = player.currentTile - 1;
    game.events.push({ chance: 'backward1' });
    game.events.push({ move: -1 });
    playOnLandTile(game);
  }
};

const forward2 = {
  play(game) {
    nextTurn(game);
  }
};

const starcity = {
  play(game) {
    nextTurn(game);
  }
};

const reducetolls = {
  play(game) {
    nextTurn(game);
  }
};

const halvetolls = {
  play(game) {
    nextTurn(game);
  }
};

const doubletolls = {
  play(game) {
    nextTurn(game);
  }
};

const triplesantorini = {
  play(game) {
    nextTurn(game);
  }
};

const attractinvestments = {
  play(game) {
    nextTurn(game);
  }
};

const taxoffice = {
  play(game) {
    nextTurn(game);
  }
};

const donate = {
  play(game) {
    nextTurn(game);
  }
};

const downgrade = {
  play(game) {
    nextTurn(game);
  }
};

const Chances = {
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

function nextTurn(game) {
    game.turns++;
    game.turnColor = game.turns % 2 === 0 ? 'player1':'player2';
    game.prompt = 'roll';
}

function playOnLandTile(game) {
  const player = game.players[game.turnColor];
  const tile = game.tiles[player.currentTile];

  switch (tile.type) {
  case "city":
    game.prompt = "buycity";
    break;
  case "chance":
    let i = Math.floor(Math.random() * Chances.all.length);
    i = 2;
    const chance = Chances.all[i];
    chance.play(game);
    break;
  case "corner":
    nextTurn(game);
  }
}

function playGame(game, move) {
  game.events = [];
  game.prompt = undefined;
  switch(move.uci) {
  case 'roll':
    let dice1 = Math.ceil(Math.random() * 6);
    let dice2 = Math.ceil(Math.random() * 6);
    dice1 = 1;
    dice2 = 2;
    const advanceAmount = dice1 + dice2;
    const player = game.players[game.turnColor];

    player.currentTile =
      (player.currentTile + advanceAmount);

    game.events.push({ roll: [dice1, dice2] });
    if (player.currentTile >= 24) {
      // passed go
      player.currentTile = player.currentTile % game.tiles.length;
    }
    game.events.push({ move: advanceAmount });

    playOnLandTile(game);
    break;
  case 'buy':
    game.events.push({ buy: move.type });
    nextTurn(game);
    break;
  case 'nobuyland':
    nextTurn(game);
    break;
  }
  
  return game;
}

export function Server() {

  const player1 = new Pov('player1');
  const player2 = new Pov('player2');
  
  const game = {
    prompt: 'roll',
    turnColor: 'player1',
    turns: 0,
    players: {
      player1: {
        name: 'Player 1',
        cash: 1000,
        asset: 0,
        currentTile: 0
      },
      player2: {
        name: 'Player 2',
        cash: 1000,
        asset: 0,
        currentTile: 0
      },
    },
    tiles: [
      { type: 'corner', key: 'go' },
      { type: 'city', key: 'hongkong' },
      { type: 'city', key: 'shanghai' },
      { type: 'chance', key: 'chance' },
      { type: 'city', key: 'jakarta' },
      { type: 'city', key: 'singapore' },
      { type: 'corner', key: 'tornado' },
      { type: 'city', key: 'mumbai' },
      { type: 'city', key: 'tahran' },
      { type: 'chance', key: 'chance' },
      { type: 'city', key: 'buenos' },
      { type: 'city', key: 'saopaulo' },
      { type: 'corner', key: 'bomb' },
      { type: 'city', key: 'lisbon' },
      { type: 'city', key: 'madrid' },
      { type: 'chance', key: 'chance' },
      { type: 'city', key: 'berlin' },
      { type: 'city', key: 'rome' },
      { type: 'corner', key: 'flight' },
      { type: 'city', key: 'london' },
      { type: 'chance', key: 'chance' },
      { type: 'city', key: 'seoul' },
      { type: 'city', key: 'jejudo' },
      { type: 'city', key: 'newyork' }
    ],
    tolls: {}
  };

  this.members = [];

  this.connect = function(pov, handlers) {
    this.members.push(handlers);
  };

  this.send = function(pov, move) {
    if (pov === game.turnColor) {
      const events = playMove(game, move);
      requestFishnet(this, game);
      this.members.forEach(member=>
        events.map(e => {
          member.push(e.jsFor(pov));
        })
      );
    }
  };

  this.get = function() {
    requestFishnet(this, game);
    return playerView(game, player2);
  };
}


function playMove(game, move) {
  const newGame = playGame(game, move);

  if (!newGame) {
    return [];
  } else {
    return [new MoveEvent(game, move)];
  }
}

function playerView(game, pov) {
  return { playerColor: pov.color,
           ...game };
}

function requestFishnet(server, game) {
  if (game.turnColor === 'player1') {
    if (game.prompt === 'roll') {
      setTimeout(() => {
        server.send('player1', { uci: 'roll' });
      }, 1000);

    } else if (game.prompt === 'buycity') {
      setTimeout(() =>
        server.send('player1', { uci: 'buy', type: 'land' }),
        5000
      );
    }
  }
}

function Pov(color) {
  this.color = color;
}

function MoveEvent(game, move) {
  this.typ = 'move';

  this.jsFor = (pov) => {
    return {
      "t": this.typ,
      "d": {
        move,
        turns: game.turns,
        prompt: game.prompt,
        events: game.events
      }
    };
  };
}
