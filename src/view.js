import { h } from 'snabbdom';
import { Tiles, Cities, Chances } from './state';
import threeStart from './threeMain';

function canvas(ctrl) {
  return h('canvas.play_area', {
    hook: {
      insert: (vnode) => {
        const element = vnode.elm;
        threeStart(element, ctrl.data);
      }
    }
  });
}

function turn(ctrl) {
  return h('div.turn', {}, [
    h('span.stroked', 'TURN'),
    h('span.stroked', Math.ceil(ctrl.data.turns / 2))
  ]);
}

function myturn(ctrl) {
  if (ctrl.vm.myturn) {
    return h('div.myturn', {}, [
      h('span.stroked', 'MY TURN'),
      h('i.fas.fa-caret-down')
    ]);
  }
  return '';
}

function paytoll(ctrl) {
  if (ctrl.vm.payingToll) {
    const { city, amount } = ctrl.vm.payingToll;
    return h('div.popup.paytoll', [
      h('div.city_name', h('span', city.name)),
      h('div.details', [
        h('span', 'TOLL'),
        h('span', amount)
      ])
    ]);
  }
  return '';
}


function youwin(ctrl) {
  let klass, text;
  if (ctrl.vm.youwin) {
    text = 'YOU WIN';
    klass = 'yellow';
  } else if (ctrl.vm.youlose) {
    text = 'YOU LOSE';
    klass = 'gray';
  } else {
    return '';
  }

 
  return h('div.winner.' + klass, [
    h('span', text)
  ]);
}

function selectCities(ctrl) {
  if (ctrl.vm.selectCity) {
    const { cityIndexes, selected, title } = ctrl.vm.selectCity;

    const tile = Tiles[cityIndexes[selected]];
    const city = Cities[tile.key];

    const land = city['land'];


    return h('div.popup_h.select_city_wrap', [
      h('div.left_arrow', {
        on: {
          click: () => ctrl.selectCity(1)
        }
      },
        h('span.green.stroked', '<')),
      h('div.select_city', [
        h('div.up', [
          h('div.title', h('span.stroked', title)),
          h('div.details', [
            h('div.city', [
              h('span', 'CITY'),
              h('span.yellow', city.name)
            ]),
            h('div.toll', [
              h('span', 'TOLL'),
              h('span.red', land.toll)
            ])
          ])
        ]),
        h('div.button', {
          on: {
            click: () => {
              ctrl.onSelectCity();
            }
          }
        }, h('span.stroked', 'OK'))
      ]),
      h('div.right_arrow', {
        on: {
          click: () => ctrl.selectCity(1)
        }
      }, h('span.green.stroked', '>')),
    ]);
  }
  return '';
}

function sellCities(ctrl) {
  if (ctrl.vm.sellCity) {
    const { needMoney, selectedCities } = ctrl.vm.sellCity;
    const cash = selectedCities.reduce((amount, key) => {
      const toll = ctrl.data.tolls[key];
      return amount + Cities[key][toll.owned].cost;
    }, 0);
    const remain = needMoney - cash;

    const buttonKlass = remain <= 0 ? '':'disabled';
    
    return h('div.popup.sell_city', [
      h('div.up', [
        h('div.title', h('span.stroked', 'SELECT CITY TO SELL')),
        h('div.details', [
          h('div.need', [
            h('span', 'NEED MONEY'),
            h('span.yellow', needMoney)
          ]),
          h('div.remain', [
            h('span', 'REMAIN'),
            h('span.red', remain)
          ])
        ])
      ]),
      h('div.button.' + buttonKlass, {
        on: {
          click: () => {
            if (remain <= 0) ctrl.onSellCities();
          }
        }
      }, h('span.stroked', 'CONFIRM'))
    ]);
  }
  return '';
}

function showchance(ctrl) {
  if (ctrl.vm.showingChance) {
    const { key } = ctrl.vm.showingChance;
    const chance = Chances.all[key];
    return h('div.popup.chance', [
      h('img', { attrs: {
        src: 'http://placekitten.com/200/200'
      } }),
      h('div.chance_name', h('span', chance.name)),
      h('div.details', [
        h('span', chance.details)
      ])
    ]);
  }
  return '';
}

function noselect(ctrl) {
  if (ctrl.vm.noselect) {
    return h('div.popup.noselect_wrap',
             h('div.noselect',
               h('span.yellow.stroked', 'There is no place to select')
              )
            );
  }
  return '';
}

function reducetolls(ctrl) {
  if (ctrl.vm.reduceTolls) {
    return h('div.popup.reducetolls', [
      h('div.turns', [
        h('span.yellow', '3'),
        h('span', 'TURNS'),
      ]),
      h('div.toll', [
        h('span', 'TOLL'),
        h('span.red', '0')
      ]),
      h('span.city', Cities[ctrl.vm.reduceTolls].name)
    ]);    
  }
  return '';
}

function starcity(ctrl) {
  if (ctrl.vm.starCity) {
    return h('div.popup.starcity', [
      h('span.star.yellow', 'STARCITY'),
      h('div.toll', [
        h('span', 'TOLL'),
        h('span', 'x'),
        h('span', '2')
      ]),
      h('span.city', Cities[ctrl.vm.starCity].name)
    ]);
  }
  return '';
}

function themepark(ctrl) {
  if (ctrl.vm.themePark) {
    return h('div.popup.themepark', [
      h('span.build', 'BUILD'),
      h('span.park', 'THEMEPARK'),
      h('div.toll', [
        h('span', 'TOLL'),
        h('span', 'x'),
        h('span', '2')
      ]),
      h('span.city', Cities[ctrl.vm.themePark].name)
    ]);
  }
  return '';
}

function overlay(ctrl) {
  if (ctrl.vm.rollingDice) {
    return h('div.roll_overlay');
  }
  return '';
}

function roll(ctrl) {
  if (ctrl.vm.rollingDice) {
    return h('div.roll_wrap', {
      style: {
        transition: 'transform .2s',
        remove: { transform: 'scale(0, 0)' }
      }
    },
             h('div.roll', {
               on: {
                 click: () => ctrl.onRoll()
               }
             }, h('span', 'ROLL'))
            );
  }
  return '';
}

function double(ctrl) {
  if (ctrl.vm.double) {
    return h('div.double_wrap', {
      style: {
        transition: 'transform .2s',
        remove: { transform: 'scale(0, 0)' }
      }
    },
             h('span.yellowred', 'DOUBLE')
            );
    
  }
  return '';
}

function dice(ctrl) {
  if (ctrl.vm.dice) {

    return h('div.dice_wrap', {
      style: {
        transition: 'transform .2s',
        remove: { transform: 'scale(0, 0)' }
      }
    },
             h('div.dice',
               h('span.yellow', ctrl.vm.dice)
              )
            );
    
  }
  return '';
}

function buycity(ctrl) {

  const data = ctrl.data;

  if (ctrl.vm.buyingCity) {
    const player = data.players[data.playerColor];
    const { city, toll } = ctrl.vm.buyingCity;
    const currentToll = toll?city[toll.owned].toll:undefined;
    const landTypes = ['land', 'villa', 'building', 'hotel'];
    const lands = landTypes.map(landName => {
      let land = city[landName],
          canAfford = land.cost < player.cash;
      
      let preText = '',
          landInfo = '',
          alreadyBought;

      if (!toll) {
        preText = h('span', 'BUYING');
      } else {
        alreadyBought = landTypes.indexOf(landName) <= landTypes.indexOf(toll.owned);
        if (landName === 'land') {
          preText = h('span', 'BUYING');
        }
        else if (alreadyBought) {
          preText = h('span');
        } else {
          preText = h('span', 'UPGRADE TO');
        }
      }

      if (!alreadyBought) {
        if (canAfford) {
          landInfo = h('div.land_info', [
            h('img', { attrs: {
              src: 'http://placekitten.com/200/200'
            } }),
            h('div.toll', [
              h('span', 'TOLL'),
              h('span', land.toll)]),
            h('div.cost', [
              h('span', 'COST'),
              h('span', land.cost)])
          ]);
        } else {
          landInfo = h('div.land_info.inactive', {}, [
            h('div.nomoney', h('span.stroked', 'NO MONEY')),
            h('div.toll', [
              h('span', 'TOLL'),
              h('span', land.toll)]),
            h('div.cost', [
              h('span', 'COST'),
              h('span', land.cost)])            
          ]);
        }
      } else {
        landInfo = h('div.land_info', {},
                     h('span.sold.stroked', 'SOLD OUT')
                    );
      }

      return h('div.land.' + landName,  {
        on: {
          click: () => {
            if (!alreadyBought && canAfford) 
              ctrl.onBuyland(landName);
          }
        } }, [
          preText,
          h('span.land_name', landName.toUpperCase()),
          landInfo
        ]);
    });

    return h('div.card.buycity',
             [
               h('div.close_button', {
                 on: {
                   click: () => ctrl.onNoBuyland()
                 }
               },
                 h('span.stroked.red', 'X')),
               h('div.title', [
                 h('div.toll',[
                   h('div.current', [
                     h('span', 'CURRENT'),
                     h('span', 'TOLL')
                   ]),
                   h('span', currentToll)
                 ]),
                 h('div.city', h('span', city.name)),
                 h('div.cash', [
                   h('span', 'CASH'),
                   h('span', player.cash)
                 ])
               ]),
               h('div.lands', lands)
             ]);
  }

  return '';
}

function playerCashDiff(ctrl, player) {
  const diff = ctrl.vm.playerCashDiff[player];

  if (!diff) {
    return '';
  }

  let diff_up_klass, contents;

  if (diff < 0) {
    diff_up_klass = 'diff_down';
    contents = [
      h('span.red', diff),
      h('div.diff_image', [
        h('span.stroked', 'DOWN'),
        h('i.fas.fa-arrow-down')
      ])
    ];
  } else {
    diff_up_klass = 'diff_up';
    contents = [
      h('span.green', diff),
      h('div.diff_image', [
        h('i.fas.fa-arrow-up'),
        h('span.stroked', 'UP')
      ])
    ];    
  }

  if (player === 'player2') {
    contents.reverse();
  }

  return h('div.card.cash_diff.' + diff_up_klass, contents);
}

function playerBankrupt(ctrl, key) {
  const bankrupt = ctrl.vm.bankrupt === key;
  const player = ctrl.data.players[key];

  if (!bankrupt) return '';

  return h('div.card.bankrupt', [
    h('span.name', player.name),
    h('span.red', 'BANKRUPT')
  ]);
  
}

function playerRank(ctrl, key) {
  var klass, text1, text2;

  const players = [];  
  for (var i of Object.keys(ctrl.data.players)) {
    const p = ctrl.data.players[i];
    players.push({ name: i, asset: playerAsset(ctrl, i) });
  }
  players.sort((a, b) => a.asset<b.asset?-1:1);

  var rank;
  for (i in players) {
    if (players[i].name === key) {
      rank = i;
      break;
    }
  }

  
  if (rank === '1') {
    klass = 'yellow';
    text1 = 1;
    text2 = 'ST';
  } else {
    klass = 'red';
    text1 = 2;
    text2 = 'ND';    
  }
  return h('div.rank', [
    h('span.stroked.' + klass, text1),
    h('span.stroked', text2)
  ]);
}

function playerAsset(ctrl, name) {
  const player = ctrl.data.players[name];
  const tolls = ctrl.data.tolls;

  const assets = Object.keys(tolls).reduce((amount, key) => {
    const toll = tolls[key];
    if (toll.owner !== name) return amount;
    const cost = Cities[key][toll.owned].cost;
    return amount + cost;
  }, 0);

  return assets + player.cash;
}

function player(ctrl, key) {
  const player = ctrl.data.players[key],
        isActive = key === ctrl.data.turnColor;

  let contents =            [
    h('div.username', player.name),
    h('div.score', [
      h('div.assets',
        [h('span.stroked', 'ASSET'),
         h('span.stroked.yellow', playerAsset(ctrl, key))]),
      h('div.cash',
        [h('span.stroked', 'CASH'),
         h('span.stroked.green', player.cash)]) 
    ])
  ];

  if (key === 'player2') {
    contents.reverse();
  }

  return h('div.card.player', {
    class: {
      glow: isActive
    }
  },
           contents);
}

function renderApp(ctrl) {
  return [
    canvas(ctrl),
    overlay(ctrl),
    roll(ctrl),
    dice(ctrl),
    double(ctrl),
    buycity(ctrl),
    myturn(ctrl),
    turn(ctrl),
    paytoll(ctrl),
    showchance(ctrl),
    themepark(ctrl),
    starcity(ctrl),
    reducetolls(ctrl),
    sellCities(ctrl),
    selectCities(ctrl),
    noselect(ctrl),
    youwin(ctrl),
    h('div.player_wrap.player1', {}, [
      playerCashDiff(ctrl, 'player1'),
      playerBankrupt(ctrl, 'player1'),
      player(ctrl, 'player1'),
      playerRank(ctrl, 'player1')
    ]),
    h('div.player_wrap.player2', {}, [
      playerRank(ctrl, 'player2'),
      playerCashDiff(ctrl, 'player2'),
      playerBankrupt(ctrl, 'player2'),
      player(ctrl, 'player2'),
    ])
  ];
}

export default function(ctrl) {

  return h('div.app_wrap', [
    h('div.app', renderApp(ctrl))
  ]);
  
}
