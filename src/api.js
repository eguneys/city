import TWEEN from '@tweenjs/tween.js';

import { configure } from './config';

export default function start(ctrl, redraw) {

  return {

    set(config) {
      anim(ctrl.data, (state) => configure(state, config));
      redraw();
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
      anim(ctrl.data, () => { ctrl.clearCamera(); });
    },

    buyCity(land) {
      anim(ctrl.data, () => { ctrl.buyCity(land); });
    },

    roll(dice1, dice2, fn) {
      ctrl.roll(dice1, dice2, fn);
      redraw();
    },

    move(amount, nofollow, fn) {
      anim(ctrl.data, () => { ctrl.move(amount, nofollow, fn); });
    }
  };

}

const perf = window.performance !== undefined ? window.performance : Date;

const raf = window.requestAnimationFrame;

function anim(state, mutate) {
  const result = mutate(state);

  step(state, perf.now());

  function step() {
    // state.redraw();
    const tweens = TWEEN.getAll();

    TWEEN.update();
    state.redraw();
    state.threeD.redraw();

    if (tweens.length === 0) {
      return;
    }
    raf((now = perf.now()) => step(state, now));
  }
}
