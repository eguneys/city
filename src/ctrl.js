import { Settings, Tiles, Cities } from './state';
import TWEEN from '@tweenjs/tween.js';
import { vec3, addProperty, getTilePosition, selectCityTexture, newSprite } from './objects';
import { mesh, geoCube, matBasic } from './objects';
import { bindSelectEvents } from './select';

import { tileNeighbors } from './util';

function callUserFunction(f, ...args) {
  if (f) setTimeout(() => f(...args), 1);
}

export default function Controller(state, redraw) {

  this.data = state;

  this.vm = {
    playerCashDiff: { }
  };

  this.youWin = function() {
    this.vm.youwin = true;
    this.vm.rollingDice = false;
    redraw();
    return new Promise(resolve => 
      setTimeout(resolve, 2000));
  };

  this.youLose = function() {
    this.vm.youlose = true;
    this.vm.rollingDice = false;
    redraw();
    return new Promise(resolve => 
      setTimeout(resolve, 2000));
  };

  this.playerCashDiff = function(player, diff) {
    const oldAmount = state.players[player].cash;
    return this.playerCash(player, oldAmount + diff);
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

    return new Promise(resolve =>
      setTimeout(() => {
        delete this.vm.payingToll;
        redraw();
        resolve();
      }, 2500)
    );
  };

  this.payToll = function(showPaytoll) {
    const fromPlayerKey = state.turnColor;
    const fromPlayer = state.players[fromPlayerKey];

    const currentTile = fromPlayer.currentTile;
    const cityKey = Tiles[currentTile].key;

    const city = Cities[cityKey];
    const toll = state.tolls[cityKey];
    const amount = city[toll.owned].toll;
    const toPlayerKey = toll.owner;
    const toPlayer = state.players[toPlayerKey];

    const fromCashNew = fromPlayer.cash - amount,
          toCashNew = toPlayer.cash + amount;

    setTimeout(() => {
      this.playerCash(fromPlayerKey, fromCashNew);
      redraw();
    }, 0);

    return new Promise(resolve =>
      setTimeout(() => {
        const cashPromise = this.playerCash(toPlayerKey, toCashNew);
        redraw();

        if (!showPaytoll) {
          cashPromise.then(resolve);
          return;
        }
        setTimeout(() => {
          this.showPayToll(city, amount).then(resolve);
        }, 1000);
      }, 200)
    );
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
          tile = Tiles[player.currentTile],
          city = Cities[tile.key],
          toll = state.tolls[tile.key];

    this.vm.buyingCity = { city, toll };
  };

  this.promptSell = function(needMoney) {
    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor];

    const cityIndexes = [];
    Tiles.forEach((tile, i) => {
      const toll = state.tolls[tile.key];
      if (toll && toll.owner === state.turnColor) {
        cityIndexes.push(i);
      }
    });

    const unbind = bindSelectEvents(this, redraw);

    this.vm.sellCity = {
      needMoney,
      selectedCities: [],
      clickables: []
    };

    const undoChanges = cityIndexes.map(index => {
      const tile = Tiles[index];
      const toll = state.tolls[tile.key];
      const ownedLand = Cities[tile.key][toll.owned];  
      const amount = ownedLand.cost;
      const tileMesh = threeD.tiles[index];
      tileMesh.position.z += 2;
      //const sprite = newSprite({ map: selectCityTexture(128, 0xcdcd00) });
      const sprite = newSprite({ map: selectCityTexture(amount, '#cdfd00', '#bac000')});
      sprite.scale.set(16, 4, 1.0);
      sprite.position.set(5, 0, 5);
      // const sprite = mesh(geoCube(20, 10, 10), matBasic({map: selectCityTexture(128, 0xcdcd00)}));
      sprite.tileIndex = index;
      sprite.tileAmount = amount;
      sprite.tileKey = tile.key;

      tileMesh.add(sprite);
      this.vm.sellCity.clickables.push(sprite);

      return () => {
        tileMesh.position.z -= 2;
        tileMesh.remove(sprite);
      };
    });
    this.vm.sellCity.undo = () => {
      unbind();
      undoChanges.forEach(f => f());
    };

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

  this.onSellCities = function() {
    const selectedCities = this.vm.sellCity.selectedCities;
    this.vm.sellCity.undo();
    delete this.vm.sellCity;
    redraw();
    this.data.threeD.redraw();
    callUserFunction(state.events.sellcities, selectedCities);
  };

  this.clearCamera = function() {
    const threeD = state.threeD.elements;

    var cout = tween(threeD.camera.position)
        .to(threeD.camera.basePosition, 500)
        .start();
  };

  this.bankrupt = function() {
    this.vm.bankrupt = this.data.turnColor;
    redraw();
  };

  this.cityStreak = function() {
    
  };

  this.buyCity = function(landType) {
    const player = state.players[state.turnColor],
          currentTileNo = player.currentTile,
          currentTile = Tiles[currentTileNo],
          city = Cities[currentTile.key],
          land = city[landType];

    state.tolls[currentTile.key] = {
      owner: state.turnColor,
      owned: landType,
      toll: land.toll
    };

    return this
      .playerCash(state.turnColor,
                  player.cash - land.cost);
  };

  this.sell = function(cities) {

    const amount = cities.reduce((amount, city) => {
      const toll = this.data.tolls[city];
      return Cities[city][toll.owned].cost + amount;
    }, 0);

    this.data.removeTolls = cities;
    state.players[state.turnColor].cash += amount;

    return Promise.resolve();
  };

  this.move = function(amount) {
   const isMyTurn = state.turnColor === state.playerColor,
         noFollow = !isMyTurn;

    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor],
          colors = Settings.colors[state.turnColor],
          currentTile = player.currentTile,
          nextTile = (currentTile + amount) % Tiles.length,
          nTiles = tileNeighbors(currentTile, nextTile, amount<0?-1:1, Tiles.length);
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

      if (tile === 0) {
        var go = tween({});
        go.to({ x: 100 }, 1000)
          .onStart(() => {
            this.playerCashDiff(state.turnColor,
                                300);
            redraw();
          });
        t.chain(go);
        prevTween = go;
      } else {
        prevTween = t;
      }
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
