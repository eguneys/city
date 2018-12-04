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
