import { h } from 'snabbdom';

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
    h('span.stroked', 17)
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
    return h('div.paytoll', [
      h('div.city_name', h('span', city.name)),
      h('div.details', [
        h('span', 'TOLL'),
        h('span', amount)
      ])
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

function dice(ctrl) {
  if (ctrl.vm.dice) {

    return h('div.dice_wrap', {
      style: {
        transition: 'transform .2s',
        remove: { transform: 'scale(0, 0)' }
      }
    },
             h('div.dice',
               h('span', ctrl.vm.dice)
              )
            );
    
  }
  return '';
}

function buycity(ctrl) {

  const data = ctrl.data;

  if (ctrl.vm.buyingCity) {
    const city = ctrl.vm.buyingCity;
    const player = data.players[data.playerColor];

    const lands = ['land', 'villa', 'building', 'hotel'].map(landName => {
      let land = ctrl.vm.buyingCity[landName],
          canAfford = land.cost < player.cash;
      
      let preText = '',
          landInfo = '';

      if (landName === 'land') {
        preText = h('span', 'BUYING');
      } else if (!land.owner) {
        preText = h('span', 'UPGRADE TO');
      }

      if (!land.owner) {
        if (canAfford) {
          landInfo = h('div.land_info', {}, [
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
                     h('span', 'SOLD OUT')
                    );
      }

      return h('div.land.' + landName, {}, [
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
                 h('span.stroked', 'X')),
               h('div.title', [
                 h('div.toll',[
                   h('div.current', [
                     h('span', 'CURRENT'),
                     h('span', 'TOLL')
                   ]),
                   h('span', city.currentToll)
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
      h('span', diff),
      h('div.diff_image', [
        h('span.stroked', 'DOWN'),
        h('i.fas.fa-arrow-down')
      ])
    ];
  } else {
    diff_up_klass = 'diff_up';
    contents = [
      h('span', diff),
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

function player(ctrl, key) {
  const player = ctrl.data.players[key],
        isActive = key === ctrl.data.turnColor;

  let contents =            [
    h('div.username', player.name),
    h('div.score', [
      h('div.assets',
        [h('span.stroked', 'ASSET'),
         h('span.stroked', player.asset)]),
      h('div.cash',
        [h('span.stroked', 'CASH'),
         h('span.stroked', player.cash)]) 
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
    buycity(ctrl),
    myturn(ctrl),
    turn(ctrl),
    paytoll(ctrl),
    h('div.player_wrap.player1', {}, [
      playerCashDiff(ctrl, 'player1'),
      player(ctrl, 'player1'),
      h('div.rank', [
        h('span.stroked', 1),
        h('span.stroked', 'ST')
      ])
    ]),
    h('div.player_wrap.player2', {}, [
      h('div.rank', [
        h('span.stroked', 2),
        h('span.stroked', 'ND')
      ]),
      playerCashDiff(ctrl, 'player2'),
      player(ctrl, 'player2'),
    ])
  ];
}

export default function(ctrl) {

  return h('div#app_wrap', [
    h('div.app', renderApp(ctrl))
  ]);
  
}
