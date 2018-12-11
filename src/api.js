import TWEEN from '@tweenjs/tween.js';

export default function start(ctrl, redraw) {

  return {

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

    roll(dice1, dice2, fn) {
      ctrl.roll(dice1, dice2, fn);
      redraw();
    },

    move(amount, fn) {
      anim(ctrl.data, () => { ctrl.move(amount, fn); });
    }
  };

}

const perf = window.performance !== undefined ? window.performance : Date;

const raf = window.requestAnimationFrame;

function anim(state, mutate) {
  const result = mutate();

  step(state, perf.now());

  function step() {
    // state.redraw();
    const tweens = TWEEN.getAll();

    if (tweens.length === 0) {
      return;
    }

    TWEEN.update();
    state.threeD.redraw();
    raf((now = perf.now()) => step(state, now));
  }
}
