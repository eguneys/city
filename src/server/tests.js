import { ok, is, not, isabove, deep_is, runtest, matcher, log } from './testutils';
import { makeGame, Game } from './game';
import { Buy, Nobuyland, Roll, RollWith } from './move';


const noevent = runtest(matcher((game, ename) => {
  return game.events.filter(e => !!e[ename]).length === 0;
}, 'contains event'));
const oneevent =  runtest(matcher((game, ename) => {
  return game.events.filter(e => !!e[ename]).length === 1;
}, "doesn't contain event"));

function withGame(f) {
  return f(makeGame());
}

function applyMoves(game, ...args) {
  return args.reduce((g, arg) => !!g?g.move(arg):null, game);
}

export function Tests() {
  this.run = () => {
    gameTests();
  };
}

function gameTests() {
  const game = makeGame();

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

    ok('roll move is ok', game2);
    is('contains roll event', game2.events.filter(event => !!event['roll']).length, 1);
    isabove('contains move event', game2.events.filter(event => !!event['move']).length, 1);
    // not('prompt is not roll', game2.prompt, 'roll');
  });

  log('foreveryroll');
  [RollWith(1,1), RollWith(1,2), RollWith(1,5)].forEach(rollMove => {
    log(rollMove.dice1 + rollMove.dice2);
    not('roll move is ok', makeGame().move(rollMove), null);
    not('roll move is ok', makeGame().move(rollMove), undefined);
    oneevent('contains roll event', makeGame().move(rollMove), 'roll');
    // not('prompt is not roll', makeGame().move(rollMove).prompt, 'roll');
  });

  log('buycity');
  const landOnCity = RollWith(1,1);
  withGame(game => {
    const game2 = game.move(landOnCity);
    is('prompt is ok', game2.prompt, 'buycity');
    is('turn is ok', game2.turns, 0);
    is('current tile is ok', game2.players[game2.turnColor].currentTile, 2);
    is('cannot roll twice', game2.move(Roll()), null);

    const game3 = applyMoves(makeGame(), landOnCity, Nobuyland);
    log('buycity nobuyland');
    ok('is valid', game3);
    is('prompt is ok', game3.prompt, 'roll');
    is('turn is ok', game3.turns, 1);
    noevent('no buy event', game3, 'buy');

    const game4 = applyMoves(makeGame(), landOnCity, Buy('land'));
    log('buycity buyland');
    ok('is valid', game4);
    is('prompt is ok', game4.prompt, 'roll');
    is('turn is ok', game4.turns, 1);
    oneevent('one buy event', game4, 'buy');
  });
}
