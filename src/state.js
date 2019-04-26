export const Cities = {
  newyork: {
    name: 'New York',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  jejudo: {
    name: 'Jejudo',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  seoul: {
    name: 'Seoul',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  london: {
    name: 'London',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  rome: {
    name: 'Rome',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  berlin: {
    name: 'Berlin',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  madrid: {
    name: 'Madrid',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  lisbon: {
    name: 'Lisbon',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  saopaulo: {
    name: 'SaoPaulo',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  buenos: {
    name: 'Buenos',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  tahran: {
    name: 'Tahran',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  mumbai: {
    name: 'Mumbai',
    currentToll: 0,
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  singapore: {
    name: 'Singapore',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  jakarta: {
    name: 'Jakarta',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  shanghai: {
    name: 'Shanghai',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
  hongkong: {
    name: 'Hongkong',
    land: { toll: 100, cost: 99, },
    villa: { toll: 100, cost: 99, },
    building: { toll: 100, cost: 99, },
    hotel: { toll: 100, cost: 9999 },
  },
};


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
    events: {},
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
}

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
