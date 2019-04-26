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
    colors: {
      player1: {
        color: 0xffff00,
        dx: { x: 0, y: -4 }
      },
      player2: {
        color: 0xff0000,
        dx: { x: 0, y: 0 }
      }
    },
    properties: {
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
    events: {}
  };
}

export const Chances = {
  all: {
    backward1: {
      name: "1 slot backward",
      details: "Move backward by 1 slot"
    }
  }
};
