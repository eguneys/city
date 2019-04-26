import { Chances } from './chance';

export function makeGame() {
  return new Game({
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
    tolls: {},
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
    ]
  });
}

export function Game({
  prompt, turnColor, turns, players, tolls, tiles
}) {
  this.prompt = prompt;
  this.turnColor = turnColor;
  this.turns = turns;
  this.players = players;
  this.tolls = tolls;
  this.tiles = tiles;


  const nextTurn = () => {
    this.turns++;
    this.turnColor = this.turns % 2 === 0 ? 'player1':'player2';
    this.prompt = 'roll';
    return this;
  };

  const buyLand = () => {
    const player = this.players[this.turnColor];
    const tile = this.tiles[player.currentTile];

    if (tile.key === 'city') {
      if (this.tolls[tile.key]) {
        return null;
      } else {
        this.events.push({ buy: move.type });
      }
      return nextTurn();
    }
    return null;
  };

  const rollDice = (dice1, dice2) => {
    const player = this.players[this.turnColor];
    const tile = this.tiles[player.currentTile];

    const advanceAmount = dice1 + dice2;

    player.currentTile =
      (player.currentTile + advanceAmount);

    this.events.push({ roll: [dice1, dice2] });
    if (player.currentTile >= 24) {
      // passed go
      player.currentTile = player.currentTile % this.tiles.length;
    }
    this.events.push({ move: advanceAmount });

    return this.playOnLandTile();
  };

  this.playOnLandTile = () => {
    const player = this.players[this.turnColor];
    const tile = this.tiles[player.currentTile];

    switch (tile.type) {
    case "city":
      if (this.tolls[tile.key]) {
        
      } else {
        this.prompt = "buycity";
      }
      return this;
      break;
    case "chance":
      let i = Math.floor(Math.random() * Chances.all.length);
      i = 2;
      const chance = Chances.all[i];
      return chance.play(this);
      break;
    case "corner":
      return nextTurn();
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
      return rollDice(dice1, dice2);
      break;
    case 'buy':
      return buyLand();
      break;
    case 'nobuyland':
      // nextTurn();
      return null;
      break;
    }
    return null;
  };
}

