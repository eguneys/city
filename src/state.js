export function defaults() {
  return {
    playerColor: 'player1',
    prompt: 'roll',
    turnColor: 'player1',
    players: {
      player1: {
        cash: 1000,
        currentTile: 0
      },
      player2: {
        cash: 1000,
        currentTile: 0
      },
    },
    properties: {
      seoul: {
        name: 'Seoul',
        currentToll: 100,
        land: { toll: 100, cost: 99, },
        villa: { toll: 100, cost: 99, },
        building: { toll: 100, cost: 99, },
        hotel: { toll: 100, cost: 9999 },
      }
    },
    tiles: [
      { type: 'city', key: 'seoul' }
    ],
    events: {}
  };
}
