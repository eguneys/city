import { Move } from './move';
import { makeGame } from './game';

export function Server() {

  const player1 = new Pov('player1');
  const player2 = new Pov('player2');
  
  const game = makeGame();

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
  const newGame = game.move(Move.apply(move));

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
      setTimeout(() => {
        const cash = game.players['player1'].cash;

        const types = ['hotel', 'building', 'villa', 'land'];

        for (var type of types) {
          server.send('player1', { uci: 'buy', type: type });
        };
      },
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
