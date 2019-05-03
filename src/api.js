import TWEEN from '@tweenjs/tween.js';

import { configure } from './config';

export default function start(ctrl, redraw) {

  return {

    set(config) {
      return anim(ctrl.data, (state) => {
        configure(state, config);
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

    promptSell(needMoney) {
      return anim(ctrl.data, (state) =>
                  ctrl.clearCamera())
        .then(() => {
          anim(ctrl.data, (state) => ctrl.promptSell(needMoney));
        });
    },

    promptSelect(cities, title) {
      return anim(ctrl.data, (state) =>
                  ctrl.clearCamera())
        .then(() => {
          anim(ctrl.data, (state) => ctrl.promptSelect(cities, title));
        });
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

    cityStreak(city) {
      return anim(ctrl.data, () => ctrl.cityStreak(city));
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

    buyCity(land) {
      return anim(ctrl.data, () => ctrl.buyCity(land));
    },

    sell(cities) {
      return anim(ctrl.data, () => ctrl.sell(cities));
    },

    roll(dice1, dice2) {
      return anim(ctrl.data, () => ctrl.roll(dice1, dice2));
    },

    move(amount) {
      return anim(ctrl.data, () => ctrl.move(amount));
    },
    noselect() {
      return anim(ctrl.data, () => ctrl.noselect());
    },
    themecity(city) {
      return anim(ctrl.data, () => ctrl.themecity(city));
    },
    tornado(i) {
      return anim(ctrl.data, () => ctrl.tornado(i));
    },
    bomb(i) {
      return anim(ctrl.data, () => ctrl.bomb(i));
    }
  };

}

const perf = window.performance !== undefined ? window.performance : Date;

const raf = window.requestAnimationFrame;

export function anim(state, mutate) {
  const resultP = mutate(state);

  return Promise
    .all([resultP,
           new Promise((resolve) => {


             // step(state, perf.now());

             function step() {

               TWEEN.update();
               state.redraw();
               state.threeD.redraw();

               const tweens = TWEEN.getAll();

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
