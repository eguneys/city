import TWEEN from '@tweenjs/tween.js';

import { configure } from './config';

export default function start(ctrl, redraw) {

  return {

    set(config) {
      return anim(ctrl.data, (state) => {
        configure(state, config);
        state.threeD.redrawAll();
      });
    },

    getState() {
      return ctrl.data;
    },

    promptRoll() {
      ctrl.promptRoll();
      redraw();
    },

    promptBuyCity() {
      ctrl.promptBuyCity();
      redraw();
    },

    youLose() {
      return anim(ctrl.data, () => ctrl.youLose());
    },    
    
    youWin() {
      return anim(ctrl.data, () => ctrl.youWin());
    },

    clearCamera() {
      return anim(ctrl.data, () => ctrl.clearCamera());
    },

    bankrupt() {
      return anim(ctrl.data, () => ctrl.bankrupt());
    },
    
    payToll(showPaytoll) {
      return anim(ctrl.data, () => ctrl.payToll(showPaytoll));
    },

    chance(key) {
      return anim(ctrl.data, () => ctrl.showChance(key));
    },

    selectCity(needMoney) {
      return anim(ctrl.data, () => ctrl.selectCity(needMoney));
    },

    buyCity(land) {
      return anim(ctrl.data, () => ctrl.buyCity(land));
    },

    roll(dice1, dice2) {
      return anim(ctrl.data, () => ctrl.roll(dice1, dice2));
    },

    move(amount) {
      return anim(ctrl.data, () => ctrl.move(amount));
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
