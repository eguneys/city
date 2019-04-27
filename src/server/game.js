import { Chances } from './chance';
import { Cities, Tiles } from './state';

export function testGame() {
  return new Game({
    prompt: 'roll',
    turnColor: 'player1',
    turns: 0,
    players: {
      player1: {
        cash: 200,
        currentTile: 0
      },
      player2: {
        cash: 100,
        currentTile: 0
      },
    },
    tolls: {}
  });
}

export function makeGame() {
  return new Game({
    prompt: 'roll',
    turnColor: 'player1',
    turns: 0,
    players: {
      player1: {
        cash: 2000,
        currentTile: 0
      },
      player2: {
        cash: 2000,
        currentTile: 0
      },
    },
    tolls: {},
    status: 'created'
  });
}

export function Game({
  prompt, turnColor, turns, players, tolls, status }) {
  this.prompt = prompt;
  this.turnColor = turnColor;
  this.turns = turns;
  this.players = players;
  this.tolls = tolls;
  this.status = status;

  this.finished = () => this.status === 'end';
  this.started = () => this.status === 'started';

  this.start = () => {
    if (this.started()) return;
    
    this.status = 'started';
  };

  this.nextTurn = () => {
    this.turns++;
    this.turnColor = this.turns % 2 === 0 ? 'player1':'player2';
    this.prompt = 'roll';
    return this;
  };

  const buyLandBase = (type) => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];
    const land = Cities[tile.key][type];

    if (!land) return null;

    if (player.cash < land.cost) return null;

    player.cash -= land.cost;

    this.tolls[tile.key] = {
      owned: type,
      owner: this.turnColor,
      toll: land.toll
    };
    this.events.push({ buy: type });
    return this.nextTurn();
  };

  const payToll = () => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];
    const toll = this.tolls[tile.key];
    const owner = this.players[toll.owner];
    const amount = toll.toll;

    player.cash -= amount;
    owner.cash += amount;

    this.events.push({ toll: true });

    if (player.cash <= 0) {
      this.events.push({ bankrupt: true });
      this.winner = this.turnColor==='player1'?'player2':'player1';
      this.status = 'end';
    }

    return this.nextTurn();
  };

  this.buyLand = (type) => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];
    if (tile.type === 'city') {
      if (this.tolls[tile.key]) {
        if (this.tolls[tile.key].owner === this.turnColor) {
          return buyLandBase(type);
        }
      } else {
        return buyLandBase(type);
      }
    }
    return null;
  };

  const rollDice = (dice1, dice2, chance) => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];

    const advanceAmount = dice1 + dice2;

    player.currentTile =
      (player.currentTile + advanceAmount);

    this.events.push({ roll: [dice1, dice2] });
    if (player.currentTile >= 24) {
      // passed go
      player.currentTile = player.currentTile % Tiles.length;
      player.cash += 300;
    }
    this.events.push({ move: advanceAmount });

    return this.playOnLandTile(chance);
  };

  this.playOnLandTile = (chance) => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];

    switch (tile.type) {
    case "city":
      if (this.tolls[tile.key]) {
        if (this.tolls[tile.key].owner === this.turnColor) {
          if (this.tolls[tile.key].owned === 'hotel') {
            return this.nextTurn();
          } else {
            this.prompt = "buycity";
          }
        } else {
          return payToll();
        }
      } else {
        this.prompt = "buycity";
      }
      return this;
      break;
    case "chance":
      this.events.push({ chance: chance.key });
      return chance.play(this);
      break;
    case "corner":
      return this.nextTurn();
    }
    return null;
  };

  this.move = (move) => {
    this.events = [];
    switch(move.uci) {
    case 'roll':
      if (this.prompt !== 'roll')
        return null;
      let dice1 = move.dice1;
      let dice2 = move.dice2;
      let chance = move.chance;
      return rollDice(dice1, dice2, chance);
      break;
    case 'buy':
      if (this.prompt !== 'buycity')
        return null;
      return this.buyLand(move.type);
      break;
    case 'nobuyland':
      if (this.prompt !== 'buycity')
        return null;
      return this.nextTurn();
      break;
    }
    return null;
  };
}

