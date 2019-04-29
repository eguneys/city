import { Chances } from './chance';
import { Cities, Tiles } from './state';

export function testGame() {
  return new Game({
    prompt: 'roll',
    turnColor: 'player1',
    turns: 1,
    players: {
      player1: {
        cash: 2000,
        currentTile: 0
      },
      player2: {
        cash: 0,
        currentTile: 0
      },
    },
    tolls: {
      'shanghai': { owned: 'land', owner: 'player2', toll: 10 },
      'hongkong': { owned: 'land', owner: 'player2', toll: 10 },
      'mumbai': { owned: 'land', owner: 'player2', toll: 10 },
      'london': { owned: 'land', owner: 'player2', toll: 10 },

    }
  });
}

export function makeGame() {
  return new Game({
    prompt: 'roll',
    turnColor: 'player1',
    turns: 1,
    players: {
      player1: {
        cash: 2000,
        asset: 2000,
        currentTile: 0
      },
      player2: {
        cash: 2000,
        asset: 2000,
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

  this.playerAsset = (name) => {
    const player = this.players[name];

    const assets = Object.keys(this.tolls).reduce((amount, key) => {
      const toll = this.tolls[key];
      if (toll.owner !== name) return amount;
      const cost = Cities[key][toll.owned].cost;
      return amount + cost;
    }, 0);

    return assets + Math.max(0, player.cash);
  };

  this.nextTurn = () => {
    this.turns++;
    this.turnColor = this.turns % 2 === 1 ? 'player1':'player2';
    this.prompt = 'roll';
    return this;
  };

  this.sell = (cities) => {
    if (this.prompt !== 'sell') return null;

    let amount = 0;
    for (var key of cities) {
      const toll = this.tolls[key];
      if (!toll || toll.owner !== this.turnColor) return null;
      amount += toll.cost;
    }

    if (amount < this.needMoney) return null;

    this.players[this.turnColor].cash += amount;

    this.events.push({ sell: cities });

    return payToll();
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

    if (player.cash <= 0) {
      if (this.playerAsset(this.turnColor) < Math.abs(player.cash)) {
        this.events.push({ bankrupt: true });
        this.winner = this.turnColor==='player1'?'player2':'player1';
        this.status = 'end';
        return this;
      } else {
        this.needMoney = Math.abs(player.cash);
        this.prompt = 'sell';
        return this;
      }
    } else {
      this.events.push({ toll: true });
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

  const promptBuyCityOrNot = () => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];
    const toll = this.tolls[tile.key];
    const city = Cities[tile.key];
    
    const lands = ['land', 'villa', 'building', 'hotel'];

    const availableLands = lands.filter(land => {
      if (toll && lands.indexOf(land) <= lands.indexOf(toll.owned)) {
        return false;
      }
      return city[land].cost < player.cash;
    });

    if (availableLands.length === 0) {
      return this.nextTurn();
    }
    this.prompt = "buycity";
    return this;
  };

  this.playOnLandTile = (chance) => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];

    switch (tile.type) {
    case "city":
      if (this.tolls[tile.key] && this.tolls[tile.key].owner !== this.turnColor) {
        return payToll();
      } else {
        return promptBuyCityOrNot();
      }
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
    case 'sell':
      return this.sell(move.cities);
      break;
    }
    return null;
  };
}

