export function defaults() {
  return {
    playerColor: 'player2',
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
    tolls: {},
    streaks: {},
    events: {}
  };
}

export const Cities = {
  // paris
  newyork: {
    name: 'New York',
    land: { toll: 64, cost: 187, },
    villa: { toll: 205, cost: 267, },
    building: { toll: 524, cost: 506, },
    hotel: { toll: 1207, cost: 905 },
  },
  jejudo: {
    name: 'Jejudo',
    land: { toll: 80, cost: 114, },
    villa: { toll: 100, cost: 9999, },
    building: { toll: 100, cost: 9999, },
    hotel: { toll: 100, cost: 9999 },
  },
  seoul: {
    name: 'Seoul',
    land: { toll: 82, cost: 219, },
    villa: { toll: 251, cost: 310, },
    building: { toll: 615, cost: 583, },
    hotel: { toll: 1390, cost: 1039 },
  },
  london: {
    name: 'London',
    land: { toll: 64, cost: 187, },
    villa: { toll: 205, cost: 267, },
    building: { toll: 524, cost: 506, },
    hotel: { toll: 1207, cost: 905 },
  },
  rome: {
    name: 'Rome',
    land: { toll: 55, cost: 166, },
    villa: { toll: 160, cost: 234, },
    building: { toll: 411, cost: 439, },
    hotel: { toll: 946, cost: 781 },
  },
  berlin: {
    name: 'Berlin',
    land: { toll: 60, cost: 170, },
    villa: { toll: 170, cost: 250, },
    building: { toll: 500, cost: 450, },
    hotel: { toll: 1000, cost: 800 },
  },
  madrid: {
    name: 'Madrid',
    land: { toll: 39, cost: 141, },
    villa: { toll: 123, cost: 198, },
    building: { toll: 319, cost: 369, },
    hotel: { toll: 763, cost: 654 },
  },
  lisbon: {
    name: 'Lisbon',
    land: { toll: 36, cost: 134, },
    villa: { toll: 116, cost: 191, },
    building: { toll: 307, cost: 362, },
    hotel: { toll: 740, cost: 647 },
  },
  saopaulo: {
    name: 'SaoPaulo',
    land: { toll: 30, cost: 120, },
    villa: { toll: 100, cost: 170, },
    building: { toll: 230, cost: 300, },
    hotel: { toll: 540, cost: 550 },
  },
  buenos: {
    name: 'Buenos',
    land: { toll: 27, cost: 114, },
    villa: { toll: 82, cost: 160, },
    building: { toll: 216, cost: 297, },
    hotel: { toll: 535, cost: 525 },
  },
  tahran: {
    name: 'Tahran',
    land: { toll: 16, cost: 82, },
    villa: { toll: 52, cost: 116, },
    building: { toll: 148, cost: 219, },
    hotel: { toll: 399, cost: 390 },
  },
  mumbai: {
    name: 'Mumbai',
    land: { toll: 14, cost: 75, },
    villa: { toll: 46, cost: 109, },
    building: { toll: 137, cost: 212, },
    hotel: { toll: 365, cost: 383 },
  },
  singapore: {
    name: 'Singapore',
    land: { toll: 9, cost: 62, },
    villa: { toll: 32, cost: 85, },
    building: { toll: 87, cost: 153, },
    hotel: { toll: 228, cost: 267 },
  },
  jakarta: {
    name: 'Jakarta',
    land: { toll: 7, cost: 55, },
    villa: { toll: 28, cost: 78, },
    building: { toll: 80, cost: 146, },
    hotel: { toll: 217, cost: 260 },
  },
  shanghai: {
    name: 'Shanghai',
    land: { toll: 2, cost: 30, },
    villa: { toll: 11, cost: 41, },
    building: { toll: 36, cost: 75, },
    hotel: { toll: 104, cost: 132 },
  },
  hongkong: {
    name: 'Hongkong',
    land: { toll: 2, cost: 23, },
    villa: { toll: 9, cost: 34, },
    building: { toll: 32, cost: 68, },
    hotel: { toll: 96, cost: 125 },
  },
};

export function tollMultiply(toll) {
  let amount = toll.multiply;
  if (toll.theme) amount *= 2;
  return amount;
}

export function nextTileKey(key) {
  return Tiles[tileIndexByKey(key) + 1].key;
}

export function tileIndexByKey(key) {
  for (var i = 0; i < Tiles.length; i++) {
    if (Tiles[i].key === key) return i;
  }
  return -1;
}

export const Tiles = [
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
];

export const Settings = {
  colors: {
    player1: {
      color: 0xffff00,
      dx: { x: 0, y: -4 }
    },
    player2: {
      color: 0xff0000,
      dx: { x: 0, y: 0 }
    }
  }
};

export const Chances = {
  all: {
    ragstoriches: {
      name: "Rags to Riches",
      details: "The top ranking player and the lowest ranked player exhange their cash"
    },
    visitseoul: {
      name: "Visit Seoul year",
      details: "Let's start a journey to Seoul, the capital city of South Korea"
    },
    backward1: {
      name: "1 slot backward",
      details: "Move backward by 1 slot"
    },
    forward2: {
      name: "2 slots forward",
      details: "Move forward by 2 slots"
    },
    starcity: {
      name: "Choose a star city",
      details: "The selected city will be the star city"
    },
    reducetolls: {
      name: "Reduce tolls to 0",
      details: "Tolls of the selected city are reduced to 0 for three turns"
    },
    halvetolls: {
      name: "Reduce tolls by 50%",
      details: "Tolls of the selected city are reduced by 50% for three turns"
    },
    doubletolls: {
      name: "Pay double the toll",
      details: "Pay double the tolls when you arrive at the city of another player"
    },
    triplesantorini: {
      name: "Shoot a CF in Santorini",
      details: "The beauty of the Santorini village has been shot for a commericial Land price and tolls triple"
    },
    attractinvestments: {
      name: "Attract investments",
      details: "You get the money for a construction investment fund"
    },
    taxoffice: {
      name: "Go to the tax office",
      details: "Move to the Office of Tax administration and pay your taxes"
    },
    donate: {
      name: "Please donate",
      details: "Choose one of your cities to donate to the bank"
    },
    downgrade: {
      name: "Downgrade building",
      details: "Choose one of the opponents cities and downgrade its building by one level"
    }
  }
};
