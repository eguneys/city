import TWEEN from '@tweenjs/tween.js';
import { vec3, addProperty, getTilePosition, selectCityTexture, newSprite } from './objects';
import { mesh, geoCube, matBasic } from './objects';

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

    return new Promise(resolve =>
      setTimeout(() => {
        delete this.vm.playerCashDiff[player];
        redraw();
        resolve();
      }, 2000)
    );
  };

  this.showChance = function(key) {
    this.vm.showingChance = { key };

    return new Promise(resolve =>
      setTimeout(() => {
        delete this.vm.showingChance;
        redraw();
        resolve();
      }, 2500));
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

    setTimeout(() => {
      this.playerCash(fromPlayerName, fromCashNew);
      redraw();
    }, 0);

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
    return new Promise(resolve =>
      setTimeout(() => {
        this.vm.dice = dice1 + dice2;
        redraw();

        setTimeout(() => {
          delete this.vm.dice;
          redraw();

          resolve();
        }, 1400);
      }, 1000)
    );
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
    redraw();
    setTimeout(() => {
      delete this.vm.myturn;
      redraw();
    }, 1000);
  };

  this.clearBuyCity = function() {
    delete this.vm.buyingCity;
    redraw();
  };

  this.onNoBuyland = function() {
    this.clearBuyCity();
    callUserFunction(state.events.noBuyland);
  };
  
  this.onRoll = function() {
    this.clearRoll();
    callUserFunction(state.events.roll);
  };

  this.onBuyland = function(type) {
    this.clearBuyCity();
    callUserFunction(state.events.buyland, type);
  };

  this.clearCamera = function() {
    const threeD = state.threeD.elements;

    var cout = tween(threeD.camera.position)
        .to(threeD.camera.basePosition, 500)
        .start();
  };

  this.buyCity = function(landType) {
    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor],
          currentTileNo = player.currentTile,
          currentTile = state.tiles[currentTileNo],
          property = state.properties[currentTile.key],
          land = property[landType];

    const threeDTile = threeD.tiles[currentTileNo];

    const threeDProp = addProperty(state, threeD,
                                   currentTile.key,
                                   threeDTile,
                                   state.turnColor,
                                   landType);

    threeDProp.scale.set(0, 0, 0);
    tween(threeDProp.scale)
      .to({x: 1, y: 1, z: 1 }, 500)
      .start();

    property.owner = state.turnColor;
    property.owned = landType;

    return this
      .playerCash(state.turnColor,
                  player.cash - land.cost);
  };

  this.selectCity = function() {
    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor];

    const cityIndexes = [1,2,3, 4, 8, 11, 18, 19,22,23];

    state.clickables = [];

    cityIndexes.forEach(index => {
      const amount = 128;
      const tile = threeD.tiles[index];
      tile.position.z += 2;
      //const sprite = newSprite({ map: selectCityTexture(128, 0xcdcd00) });
      const sprite = newSprite({ map: selectCityTexture(amount, '#cdfd00', '#bac000')});
      sprite.scale.set(16, 4, 1.0);
      sprite.position.set(5, 0, 5);
      // const sprite = mesh(geoCube(20, 10, 10), matBasic({map: selectCityTexture(128, 0xcdcd00)}));
      sprite.tileIndex = index;
      sprite.tileAmount = amount;

      tile.add(sprite);
      state.clickables.push(sprite);
    });
  };
  
  this.move = function(amount) {
   const isMyTurn = state.turnColor === state.playerColor,
         noFollow = !isMyTurn;

    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor],
          colors = state.colors[state.turnColor],
          currentTile = player.currentTile,
          nextTile = (currentTile + amount) % state.tiles.length,
          nTiles = tileNeighbors(currentTile, nextTile, amount<0?-1:1, state.tiles.length);
    player.currentTile = nextTile;

    const currentTilePos = getTilePosition(
      threeD.tiles, currentTile);

    var ct = tween(threeD.camera.position)
        .to({
          x: currentTilePos.x + 170,
          y: currentTilePos.y + 100,
          z: currentTilePos.z + 170
        }, 500);
    
    let firstTween, prevTween;

    for (var key in nTiles) {
      var tile = nTiles[key];
      const nextTilePos = getTilePosition(
        threeD.tiles, tile);

      var t = tween(threeD[state.turnColor]
                    .position);
      t.to({ x: nextTilePos.x + colors.dx.x,
             y: -nextTilePos.z + colors.dx.y }, 300)
        .onUpdate((e) => {
          if (!noFollow) {
            threeD.camera.position
              .set(e.x + 170,
                   e.z + 100,
                   -e.y + 170);
          }
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
      callUserFunction(state.events.afterMove);
    });

    if (noFollow) {
      firstTween.start();
    } else {
      ct.chain(firstTween);
      ct.start();
    }
  };

  function tween(obj) {
    return new TWEEN.Tween(obj);
  }
}

if (module.hot) {
  module.hot.accept('./objects', function() {
    console.log('accepting objects');
    
  });
}
