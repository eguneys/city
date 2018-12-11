import TWEEN from '@tweenjs/tween.js';
import { getTilePosition } from './objects';

import { tileNeighbors } from './util';

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

  this.roll = function(dice1, dice2, fn) {

    setTimeout(() => {
      this.vm.dice = dice1 + dice2;
      redraw();

      setTimeout(() => {
        delete this.vm.dice;
        redraw();

        callUserFunction(fn, dice1 + dice2);
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

  this.clearCamera = function() {
    const threeD = state.threeD.elements;

    var cout = tween(threeD.camera.position)
        .to(threeD.camera.basePosition, 500)
        .start();
  };  
  
  this.move = function(amount, fn) {
    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor],
          currentTile = player.currentTile,
          nextTile = (currentTile + amount) % state.tiles.length,
          nTiles = tileNeighbors(currentTile, nextTile, 1, state.tiles.length);
    player.currentTile = nextTile;

    const currentTilePos = getTilePosition(
      threeD.tiles, currentTile);

    var ct = tween(threeD.camera.position)
        .to({
          x: currentTilePos.x + 170,
          y: currentTilePos.y + 100,
          z: currentTilePos.z + 170
        }, 500);
    
    var cout = tween(threeD.camera.position)
        .to(threeD.camera.basePosition, 500);

    let firstTween, prevTween;

    for (var key in nTiles) {
      var tile = nTiles[key];
      const nextTilePos = getTilePosition(
        threeD.tiles, tile);
      nextTilePos.x += 4;
      nextTilePos.z += 4;

      var t = tween(threeD['player1']
                    .position);
      t.to({ x: nextTilePos.x,
             y: -nextTilePos.z }, 300)
        .onUpdate((e) => {
          threeD.camera.position
            .set(e.x + 170,
                 e.z + 100,
                -e.y + 170);
        });

      if (!firstTween) {
        firstTween = t;
      }

      if (prevTween) {
        prevTween.chain(t);
      }
      prevTween = t;
    }

    prevTween.onComplete(() => {
      callUserFunction(fn);
    });

    ct.chain(firstTween);
    ct.start();
  };

  function tween(obj) {
    return new TWEEN.Tween(obj);
  }
}
