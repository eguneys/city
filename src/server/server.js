var { Move } = require('./move');
var { testGame, makeGame } = require('./game');

exports.Server = function Server() {

  const player1 = new Pov('player1');
  const player2 = new Pov('player2');
  
  const game = testGame();

  this.members = [];

  this.connect = function(pov, handlers) {
    this.members.push(handlers);
  };

  this.send = function(pov, move) {
    if (pov === game.turnColor) {
      const events = playMove(this, game, move);
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


function playMove(server, game, move) {
  const newGame = game.move(Move.apply(move));

  if (!newGame) {
    console.log("invalid move",
                JSON.stringify(move));
    return [];
  } else {
    var events = [new MoveEvent(game, move)];

    if (newGame.finished()) {
      events.push(new EndEvent(game));
    } else {
      requestFishnet(server, game);
    }
    return events;
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
    } else if (game.prompt === 'sell') {
      setTimeout(() => {
        const cities = [];
        for (var key of Object.keys(game.tolls)) {
          const toll = game.tolls[key];
          if (toll.owner === 'player1') {
            cities.push(key);
          }
        }
        server.send('player1', { uci: 'sell', cities });
      }, 5000);
    } else if (game.prompt === 'themecity' ||
               game.prompt === 'starcity' ||
               game.prompt === 'reducetolls') {
      setTimeout(() => {
        const cities = game.selectCities;
        server.send('player1', { uci: 'selectcity', city: cities[0] });
      }, 5000);
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
        needMoney: game.needMoney,
        selectCities: game.selectCities,
        events: game.events
      }
    };
  };
}

function EndEvent(game) {
  this.typ = 'end';

  this.jsFor = (pov) => {
    return {
      "t": this.typ,
      "d": {
        winner: game.winner
      }
    };
  };
}
