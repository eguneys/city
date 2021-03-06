import { Settings, Tiles, Cities, nextTileKey, tollMultiply } from './state';
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
    const amount = city[toll.owned].toll * tollMultiply(toll);

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
        if (dice1 === dice2) {
          this.vm.double = true;
        }
        redraw();

        setTimeout(() => {
          delete this.vm.dice;
          delete this.vm.double;
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

  this.selectCity = function(d) {
    this.vm.selectCity.selected = (this.vm.selectCity.selected + d) % this.vm.selectCity.cityIndexes.length;
    redraw();
    state.threeD.redraw();
  };

  this.noselect = function() {
    this.vm.noselect = true;
    redraw();
    return new Promise(resolve => {
      setTimeout(() => {
        delete this.vm.noselect;
        
        redraw();
        resolve();
      }, 1000);
    });
  };

  this.promptSelect = function(cities, title) {
    const titles = {
      'themecity': 'SELECT A THEME PARK CITY',
      'starcity': 'SELECT A STAR CITY',
      'reducetolls': 'SELECT CITY TO REDUCE TOLL'
    };
    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor];

    const cityIndexes = [];

    Tiles.forEach((tile, i) => {
      if (cities.indexOf(tile.key) >= 0)
        cityIndexes.push(i);
    });

    this.vm.selectCity = {
      key: title,
      title: titles[title],
      cityIndexes,
      selected: 0
    };

    const undoChanges = cityIndexes.map(index => {
      const tile = Tiles[index];
      const toll = state.tolls[tile.key];

      const tileMesh = threeD.tiles[index];
      tileMesh.position.z += 2;

      return () => {
        tileMesh.position.z -= 2;
      };
    });

    this.vm.selectCity.undo = () => {
      undoChanges.forEach(f => f());
    };
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

  this.onSelectCity = function() {
    const city = Tiles[this.vm.selectCity.cityIndexes[
      this.vm.selectCity.selected]].key;

    const key = this.vm.selectCity.key;

    this.vm.selectCity.undo();
    delete this.vm.selectCity;
    redraw();
    state.threeD.redraw();

    callUserFunction(state.events.selectCity, city);
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


  this.cityStreak = function(city) {
    const cities = [city, nextTileKey(city)];

    state.streaks[city] = {
      color: state.turnColor,
      cities
    };

    for (var key of cities) {
      state.tolls[key].multiply = 
        state.tolls[key].multiply * 2;
    }
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
      multiply: 1
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

    cities.forEach(city => {
      if (this.data.streaks[city]) {
        this.data.streaks[city].sold = true;
        for (var streak of this.data.streaks[city].cities) {
          if (this.data.tolls[streak]) {
            this.data.tolls[streak].multiply = 1;
          }
        }
      }
    });

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

  this.reduceexpire = (city) => {
    console.log(city);
    console.log(this.data.tolls);
    delete this.data.tolls[city].reduce0;
    this.data.threeD.redraw();
  };

  const tweenFollowCity = (city, onComplete) => {
    const threeD = this.data.threeD.elements;
    const cityIndex = Tiles.findIndex(tile => tile.key === city);

    const themeTilePos = getTilePosition(
      threeD.tiles, cityIndex);

    return tween(threeD.camera.position)
      .to({ x: themeTilePos.x + 170,
            y: 100,
            z: themeTilePos.z + 170 }, 500)
      .delay(1000)
      .chain(tween({}).to({x:10}, 1000))
      .onComplete(onComplete)
      .start();
  };

  this.starcity = function(city) {
    this.vm.starCity = city;

    tweenFollowCity(city, () => {
      this.data.tolls[city].star = true;
    });

    return new Promise(resolve =>
      setTimeout(() => {
        delete this.vm.starCity;
        redraw();
        resolve();
      }, 1000)
    );    
  };

  this.themecity = function(city) {
    this.vm.themePark = city;

    tweenFollowCity(city, () => {
      this.data.tolls[city].theme = true;
    });

    return new Promise(resolve =>
      setTimeout(() => {
        delete this.vm.themePark;
        redraw();
        resolve();
      }, 1000)
    );
  };

  this.reducetolls = function(city) {
    this.vm.reduceTolls = city;

    tweenFollowCity(city, () => {
      this.data.tolls[city].reduce0 = 3 * 2;
    });

    return new Promise(resolve =>
      setTimeout(() => {
        delete this.vm.reduceTolls;
        redraw();
        resolve();
      }, 1000)
    );
  };

  this.bomb = function(i) {
    const threeD = state.threeD.elements;
    const city = Tiles[i].key;

    this.clearCamera();

    this.data.addBomb = {
      i,
      onComplete: () => {
        if (this.data.streaks[city]) {
          this.data.streaks[city].sold = true;
          for (var streakCity of this.data.streaks[city].cities) {
            this.data.tolls[streakCity].multiply = 1;
          }
        }
        if (this.data.tolls[city]) {
          this.data.removeTolls = [city];
        }
      }
    };
  };

  this.tornado = function(i) {
    const isMyTurn = state.turnColor === state.playerColor,
          noFollow = !isMyTurn;

    const threeD = state.threeD.elements;
    const player = state.players[state.turnColor],
          colors = Settings.colors[state.turnColor],
          currentTile = player.currentTile,
          nextTile = i;
    
    player.currentTile = nextTile;

    const currentTilePos = getTilePosition(
      threeD.tiles, currentTile);

    const nextTilePos = getTilePosition(
      threeD.tiles, nextTile);

    const threeDPlayer = threeD[state.turnColor];
    const oldZ = threeDPlayer.position.z;

    var t = tween(threeDPlayer.position)
        .to({ z: 100 })
        .onComplete(() => {
          threeDPlayer.position.x = nextTilePos.x + colors.dx.x;
          threeDPlayer.position.y = -nextTilePos.z + colors.dx.y;
          var cameraTween;
          if (!noFollow) {
            cameraTween = tween(threeD.camera.position)
              .to({ x: threeDPlayer.position.x + 170,
                    y: oldZ + 100,
                    z: -threeDPlayer.position.y + 170 }, 500);
          } else {
            cameraTween = tween({}).to({x:0}, 500);
          }

          cameraTween.onComplete(() => {
            var t2 = tween(threeDPlayer.position)
                .to({ z: oldZ })
                .onStart(() => {
                }).start();
          });
          cameraTween.start();
        });
    t.start();
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
