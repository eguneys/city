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
        cash: 460,
        currentTile: 0
      },
    },
    streaks: {},
    tolls: {
      // 'shanghai': { owned: 'land', owner: 'player2' },
      // 'hongkong': { owned: 'land', owner: 'player2' },
      // 'mumbai': { owned: 'land', owner: 'player2' },
      // 'london': { owned: 'land', owner: 'player2' },

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
        currentTile: 0
      },
      player2: {
        cash: 2000,
        currentTile: 0
      },
    },
    tolls: {},
    streaks: {},
    status: 'created'
  });
}

export function Game({
  prompt, turnColor, turns, players, tolls, streaks, status }) {
  this.prompt = prompt;
  this.turnColor = turnColor;
  this.turns = turns;
  this.players = players;
  this.tolls = tolls;
  this.streaks = streaks;
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

    return assets + player.cash;
  };

  this.nextTurn = () => {
    this.turns++;
    this.turnColor = this.turns % 2 === 1 ? 'player1':'player2';
    this.prompt = 'roll';
    return this;
  };

  this.sell = (cities) => {
    if (this.prompt !== 'sell') return null;

    const player = this.players[this.turnColor];
    let amount = 0;
    for (var key of cities) {
      const toll = this.tolls[key];
      if (!toll || toll.owner !== this.turnColor) return null;
      amount += Cities[key][toll.owned].cost;
    }

    if (player.cash + amount < this.needMoney) return null;

    for (key of cities) {
      removeToll(key);
    }

    delete this.needMoney;
    player.cash += amount;

    this.events.push({ sell: cities });

    return payToll();
  };

  const removeToll = (key) => {
    delete this.tolls[key];
    if (this.streaks[key]) {
      this.streaks[key].sold = true;
      for (var streak of this.streaks[key].cities) {
        if (this.tolls[streak])
          this.tolls[streak].multiply = 1;
      }
    }
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
      multiply: 1
    };
    this.events.push({ buy: type });

    cityStreak();

    return this.nextTurn();
  };

  const cityStreak = (key) => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];
    const tilePrev = Tiles[player.currentTile - 1];
    const tileNext = Tiles[(player.currentTile + 1) % Tiles.length];


    const toll = this.tolls[tile.key],
          tollNext = this.tolls[tileNext.key],
          tollPrev = this.tolls[tilePrev.key];

    // prevent jejudo from streak
    if (tile.key === 'jejudo' || tileNext.key === 'jejudo' || tilePrev.key === 'jejudo') return;

    if (toll && tollNext &&
        toll.owner === tollNext.owner &&
        (!this.streaks[tile.key] || this.streaks[tile.key].sold)) {
      toll.multiply *= 2;
      tollNext.multiply *= 2;

      this.streaks[tile.key] = {
        color: this.turnColor,
        cities: [tile.key, tileNext.key]
      };
      this.streaks[tileNext.key] = this.streaks[tile.key];

      this.events.push({ streak: tile.key });
    } else if (toll && tollPrev && 
               toll.owner === tollPrev.owner &&
               (!this.streaks[tilePrev.key] || this.streaks[tilePrev.key].sold)) {
      toll.multiply *= 2;
      tollPrev.multiply *= 2;

      this.streaks[tilePrev.key] = {
        color: this.turnColor,
        cities: [tilePrev.key, tile.key]
      };

      this.events.push({ streak: tilePrev.key });      
    }
    

  };

  const payToll = () => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];
    const toll = this.tolls[tile.key];
    const owner = this.players[toll.owner];
    const amount = Cities[tile.key][toll.owned].toll * toll.multiply;

    if (player.cash < amount) {
      if (this.playerAsset(this.turnColor) < amount) {
        this.events.push({ bankrupt: true });
        this.winner = this.turnColor==='player1'?'player2':'player1';
        this.status = 'end';
        return this;
      } else {
        this.needMoney = Math.abs(player.cash - amount);
        this.prompt = 'sell';
        return this;
      }
    } else {
      player.cash -= amount;
      owner.cash += amount;
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

  const playCorner = () => {
    const player = this.players[this.turnColor];
    const tile = Tiles[player.currentTile];

    if (tile.key === 'tornado') {
      player.currentTile = Tiles.safeIndex();
      this.events.push({ tornado: player.currentTile });

      return this.playOnLandTile(Chances.random());
    } if (tile.key === 'bomb') {
      const bombCity = Tiles.cityIndex();
      this.events.push({ bomb: bombCity });
      removeToll(Tiles[bombCity].key);
    }
    return this.nextTurn();
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
      return playCorner();
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

