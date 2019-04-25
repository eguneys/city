function playGame(game, move) {
  game.events = [];
  switch(move) {
  case 'roll':
    const dice1 = Math.ceil(Math.random() * 6);
    const dice2 = Math.ceil(Math.random() * 6);
    game.events.push({ roll: [dice1, dice2] });
    game.players[game.turnColor].currentTile =
      (game.players[game.turnColor].currentTile + dice1 + dice2);
    if (game.players[game.turnColor].currentTile >= 24) {
      // passed go
      game.players[game.turnColor].currentTile = game.players[game.turnColor].currentTile % 24;
    }
    game.events.push({ move: game.players[game.turnColor].currentTile});
  }
  
  return game;
}

export function Server() {

  const player1 = new Pov('player1');
  const player2 = new Pov('player2');
  
  const game = {
    prompt: 'roll',
    turnColor: 'player1',
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
    tolls: {}
  };

  this.members = {};

  this.connect = function(pov, handlers) {
    this.members[pov]  = handlers;
  };

  this.send = function(pov, move) {
    if (pov === game.turnColor) {
      const events = playMove(game, move);

      events.map(e => this.members[pov][e.typ](e.jsFor(pov)));
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
      server.send('player1', 'roll');
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
      events: game.events
    };
  };
}
