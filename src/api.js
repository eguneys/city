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

    roll(dice1, dice2) {
      ctrl.roll(dice1, dice2);
      redraw();
    }



  };

}
