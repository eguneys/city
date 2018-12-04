
function callUserFunction(f, ...args) {
  if (f) setTimeout(() => f(...args), 1);
}

export default function Controller(state, redraw) {

  this.data = state;

  this.vm = {
    playerCashDiff: { }
  };

  this.playerCash = function(player, newAmount) {
    const oldAmount = state.players[player].cash;
    state.players[player].cash = newAmount;

    const diff = newAmount - oldAmount;
    this.vm.playerCashDiff[player] = diff;

    setTimeout(() => {
      delete this.vm.playerCashDiff[player];
      redraw();
    }, 2000);
  };

  this.showPayToll = function(city, amount) {
    this.vm.payingToll = {
      city, amount
    };

    setTimeout(() => {
      delete this.vm.payingToll;
      redraw();
    }, 2500);
  };

  this.payToll = function(fromPlayerName, toPlayerName, cityName) {
    const city = state.properties[cityName];
    const amount = city.currentToll;

    const fromPlayer = state.players[fromPlayerName],
          toPlayer = state.players[toPlayerName];

    const fromCashNew = fromPlayer.cash - amount,
          toCashNew = toPlayer.cash + amount;

    this.playerCash(fromPlayerName, fromCashNew);

    setTimeout(() => {
      this.playerCash(toPlayerName, toCashNew);
      redraw();

      setTimeout(() => {
        this.showPayToll(city, amount);
        redraw();
      }, 1000);
    }, 1000);
  };  

  this.roll = function(dice1, dice2) {

    setTimeout(() => {
      this.vm.dice = dice1 + dice2;
      redraw();

      setTimeout(() => {
        delete this.vm.dice;
        redraw();
      }, 1400);
    }, 1000);
  };

  this.promptRoll = function() {
    this.vm.rollingDice = true;
    this.vm.myturn = true;
  };

  this.promptBuyCity = function() {
    const player = state.players[state.playerColor],
          tile = state.tiles[player.currentTile],
          city = state.properties[tile.key];

    this.vm.buyingCity = city;
  };

  this.clearRoll = function() {
    delete this.vm.rollingDice;

    setTimeout(() => {
      delete this.vm.myturn;
      redraw();
    }, 1000);
  };

  this.clearBuyCity = function() {
    delete this.vm.buyingCity;
  };

  this.onNoBuyland = function() {
    callUserFunction(state.events.noBuyland);
  };
  
  this.onRoll = function() {
    callUserFunction(state.events.roll);
  };
}
