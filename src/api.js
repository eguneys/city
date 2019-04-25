import TWEEN from '@tweenjs/tween.js';

import { configure } from './config';

export default function start(ctrl, redraw) {

  return {

    set(config) {
      return anim(ctrl.data, (state) => configure(state, config));
    },

    getState() {
      return ctrl.data;
    },

    playerCash(player, newAmount) {
      ctrl.playerCash(player, newAmount);
      redraw();
    },

    payToll(fromPlayer, toPlayer, city) {
      ctrl.payToll(fromPlayer, toPlayer, city);
      redraw();
    },

    promptRoll() {
      ctrl.promptRoll();
      redraw();
    },

    promptBuyCity() {
      ctrl.promptBuyCity();
      redraw();
    },

    clearRoll () {
      ctrl.clearRoll();
      redraw();
    },

    clearBuyCity () {
      ctrl.clearBuyCity();
      redraw();
    },

    clearCamera() {
      return anim(ctrl.data, () => { return ctrl.clearCamera(); });
    },

    buyCity(land) {
      return anim(ctrl.data, () => { return ctrl.buyCity(land); });
    },

    roll(dice1, dice2) {
      return anim(ctrl.data, () => { return ctrl.roll(dice1, dice2); });
    },

    move(amount) {
      return anim(ctrl.data, () => { return ctrl.move(amount); });
    }
  };

}

const perf = window.performance !== undefined ? window.performance : Date;

const raf = window.requestAnimationFrame;

function anim(state, mutate) {
  const resultP = mutate(state);

  return Promise
    .all([resultP,
           new Promise((resolve) => {


             // step(state, perf.now());

             function step() {
               // state.redraw();
               const tweens = TWEEN.getAll();

               TWEEN.update();
               state.redraw();
               state.threeD.redraw();

               if (tweens.length === 0) {
                 resolve();
                 return;
               }
               raf((now = perf.now()) => step(state, now));
             }
             raf((now = perf.now()) => step(state, now));
  })
          ]);
}
