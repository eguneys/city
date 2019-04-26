function playOnLandTile(game) {
  const player = game.players[game.turnColor];
  const tile = game.tiles[player.currentTile];

  switch (tile.type) {
  case "city":
    game.prompt = "buycity";
    break;
  }
}

function playGame(game, move) {
  game.events = [];
  game.prompt = undefined;
  switch(move.uci) {
  case 'roll':
    const dice1 = Math.ceil(Math.random() * 6);
    const dice2 = Math.ceil(Math.random() * 6);
    game.events.push({ roll: [dice1, dice2] });
    game.players[game.turnColor].currentTile =
      (game.players[game.turnColor].currentTile + dice1 + dice2);
    if (game.players[game.turnColor].currentTile >= 24) {
      // passed go
      game.players[game.turnColor].currentTile = game.players[game.turnColor].currentTile % game.tiles.length;
    }
    game.events.push({ move: game.players[game.turnColor].currentTile});

    playOnLandTile(game);
    break;
  case 'buy':
    game.turns++;
    game.turnColor = game.turns % 2 === 0 ? 'player1':'player2';
    game.prompt = 'roll';
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
          member[e.typ](e.jsFor(pov));
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
      setTimeout(() =>
        server.send('player1', { uci: 'roll' }), 1000);
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
      move,
      turns: game.turns,
      prompt: game.prompt,
      events: game.events
    };
  };
}
