import { is, not, isabove, deep_is, runtest, log } from './testutils';
import { makeGame, Game } from './game';
import { Buy, Nobuyland, Roll, RollWith } from './move';


function withGame(f) {
  return f(makeGame());
}

export function Tests() {
  this.run = () => {
    gameTests();
  };
}

function gameTests() {
  const game = makeGame();
  console.log(game);

  const invalidMoves = [Buy('land'),
                        Nobuyland];
                        
  invalidMoves.forEach(move =>
    withGame(game => {
      var game2 = game.move(move);
      is(`can't ${move.uci} on first move`,
         game2, null);
    })
  );

  withGame(game => {
    var roll = Roll();
    var game2 = game.move(roll);
    log('for random roll' + (roll.dice1 + roll.dice2));

    not('roll move is ok', game2, null);
    not('roll move is ok', game2, undefined);
    is('contains roll event', game2.events.filter(event => !!event['roll']).length, 1);
    isabove('contains move event', game2.events.filter(event => !!event['move']).length, 1);
    // not('prompt is not roll', game2.prompt, 'roll');
  });

  log('foreveryroll');
  [RollWith(1,1), RollWith(1,2), RollWith(1,5)].forEach(rollMove => {
    log(rollMove.dice1 + rollMove.dice2);
    not('roll move is ok', makeGame().move(rollMove), null);
    not('roll move is ok', makeGame().move(rollMove), undefined);
    is('contains roll event', makeGame().move(rollMove).events.filter(event => !!event['roll']).length, 1);
    // not('prompt is not roll', makeGame().move(rollMove).prompt, 'roll');
  });

  log('buycity');
  const landOnCity = RollWith(1,1);
  withGame(game => {
    const game2 = game.move(landOnCity);
    is('prompt is ok', game2.prompt, 'buycity');
    is('turn is ok', game2.turns, 0);
    is('cannot roll', game2.move(Roll()), null);
  });
}
