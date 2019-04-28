import { ok, is, not, isabove, deep_is, runtest, matcher, log } from './testutils';
import { makeGame, Game } from './game';
import { Buy, Nobuyland, Roll, RollWith } from './move';
import { Cities, Tiles } from './state';


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

  withGame(game => {
    const invalidMoves = [Buy('land'),
                          Nobuyland];
    
    invalidMoves.forEach(move =>
      withGame(game => {
        var game2 = game.move(move);
        is(`can't ${move.uci} on first move`,
           game2, null);
      })
    );
  });

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
  let chance = 'ragstoriches';
  [RollWith(1,1), RollWith(1,2, chance), RollWith(1,5)].forEach(rollMove => {
    log(rollMove.dice1 + rollMove.dice2);
    not('roll move is ok', makeGame().move(rollMove), null);
    not('roll move is ok', makeGame().move(rollMove), undefined);
    oneevent('contains roll event', makeGame().move(rollMove), 'roll');
    // not('prompt is not roll', makeGame().move(rollMove).prompt, 'roll');
  });

  log('buycity');
  const landOnCity = RollWith(1,1);
  const landOnCity2 = RollWith(1,3);
  const landOnChance = RollWith(1,2, 'ragstoriches');
  const landOnCorner = RollWith(3,3);
  withGame(game => {
    const game2 = game.move(landOnCity);
    is('prompt is ok', game2.prompt, 'buycity');
    is('turn is ok', game2.turns, 1);
    is('current tile is ok', game2.players[game2.turnColor].currentTile, 2);
    is('cannot roll twice', game2.move(Roll()), null);
  });

  withGame(game => {
    const game2 = applyMoves(game, landOnCity, Nobuyland);
    log('buycity nobuyland');
    ok('is valid', game2);
    is('prompt is ok', game2.prompt, 'roll');
    is('turn is ok', game2.turns, 2);
    noevent('no buy event', game2, 'buy');
  });

  withGame(game => {
    const game2 = applyMoves(game, landOnCity, Buy('land'));
    log('buycity buyland');
    ok('is valid', game2);
    is('prompt is ok', game2.prompt, 'roll');
    is('turn is ok', game2.turns, 2);
    oneevent('one buy event', game2, 'buy');

    log('buycity buyland on no cash');
    game2.players['player2'].cash = 1;
    const game3 = game.move(landOnCity2);
    is('prompt is ok', game2.prompt, 'roll');
    is('turn is next turn', game2.turns, 3);
  });
  
  withGame(game => {
    const game2 = applyMoves(game, landOnCity, Nobuyland, landOnCity, Nobuyland);
    log('buycity start roll on city');
    ok('is valid', game2);
    is('prompt is ok', game2.prompt, 'roll');
    is('turn is ok', game2.turns, 3);

    const game3 = game2.move(Buy('land'));
    is('not possible to buyland before roll', game3, null);
  });

  withGame(game => {
    log('land on chance');
    const game2 = applyMoves(game, landOnChance);
    const game3 = applyMoves(makeGame(), landOnChance, Nobuyland);
    const game4 = applyMoves(makeGame(), landOnChance, Buy("land"));
    not('no buy prompt', game2.prompt, 'buycity');
    oneevent('chance event', game2, 'chance');
    is('cant nobuyland', game3, null);
    is('cant buyland', game4, null);
  });

  withGame(game => {
    log('land on corner');
    const game2 = applyMoves(game, landOnCorner);
    not('no buy prompt', game2.prompt, 'buycity');
    is('cant nobuyland', game2.move(Nobuyland), null);
    is('cant buyland', game2.move(Buy("land")), null);
  });

  const landOnSame = RollWith(Tiles.length, 0);
  withGame(game => {
    log('pay toll');
    const game2 = applyMoves(game, landOnCity, Buy("land"), landOnCity);
    is('prompt roll', game2.prompt, 'roll');
    is('turns ok', game2.turns, 3);
    oneevent('paytoll event', game2, 'toll');
    log("land on own city when land owned");
    const game3 = game.move(landOnSame);
    is('prompt buycity', game3.prompt, 'buycity');
    is('turns ok', game3.turns, 3);
    noevent('no paytoll', game3, 'toll');
    log("land on own city when hotel owned");
    const game4 = applyMoves(game3,
                             Buy('hotel'),
                             landOnCity,
                             Nobuyland,
                             landOnSame);
    ok('is valid', game4);
    is('prompt is roll', game4.prompt, 'roll');
    is ('turns ok', game4.turns, 6);
    noevent('no paytoll', game4, 'toll');
    log("buy land twice");
    const game5 = applyMoves(makeGame(),
                             landOnCity,
                             Buy("land"),
                             landOnCity,
                             landOnSame,
                             Buy('land'));
    // is('not valid', game5, null);
  });

  const landOnShanghai = RollWith(2, 0);
  const landOnGo = RollWith(Tiles.length, 0);
  const passGo = RollWith(Tiles.length, 3, 'starcity');
  withGame(game => {
    log("cash payments");
    const game2 = applyMoves(game, landOnShanghai, Buy("land"));
    is('buy land pays cash', game2.players['player1'].cash, 2000 - Cities['shanghai']['land'].cost);
    const game3 = applyMoves(game, landOnShanghai);
    is('pay toll pays cash', game2.players['player2'].cash, 2000 - Cities['shanghai']['land'].toll);
    is('payed toll earns cash', game2.players['player1'].cash, 2000 - Cities['shanghai']['land'].cost + Cities['shanghai']['land'].toll);

    const game4 = applyMoves(makeGame(), landOnGo);
    is('land on go earns cash', game4.players['player1'].cash, 2300);
    is('pass go earns cash', game4.move(passGo).players['player1'].cash, 2300);
   
    const game5 = makeGame();
    game5.players['player1'].cash = 100;
    const game6 = applyMoves(game5, landOnShanghai, Buy("hotel"));
    is('cant afford buy', game6, null);
  });

  withGame(game => {
    log("finish game");
    game.players['player2'].cash = 10;
    const game2 = applyMoves(game, landOnShanghai,
                             Buy("hotel"), landOnShanghai);
    is("game ends when player bankrupts", game2.finished(), true);
    is("game winner", game2.winner, 'player1');
    oneevent("player bankrupts", game2, 'bankrupt');
  });

  withGame(game => {
    log("player assets");
    is("cash is asset", game.playerAsset('player1'), game.players['player1'].cash);
    const game2 = applyMoves(game, landOnShanghai, Buy("land"));
    const landCost = Cities['shanghai']['land'].cost;
    is("land is asset", game.playerAsset('player1'), game2.players['player1'].cash + landCost);

    log("pay toll on low cash with assets");
    // jakarta land toll 7
    const game3 = applyMoves(makeGame(),
                             landOnShanghai,
                             Buy("land"),
                             RollWith(4, 0),
                             Buy("land"));
    game3.players['player1'].cash = 0;
    const game4 = game3.move(RollWith(2, 0));
    is("prompt is sell", game4.prompt, 'sell');
    is("turn is ok", game4.turns, 3);
    noevent("no bankrupt", game4, 'bankrupt');
    noevent("no bankrupt", game4, 'toll');
    not('game is not finished', game4.finished(), true);

    log("pay toll on low cash with no assets");
    // jakarta land toll 7
    const game5 = applyMoves(makeGame(),
                             RollWith(2, 0),
                             Nobuyland,
                             RollWith(4, 0),
                             Buy("land"));
    game5.players['player1'].cash = 0;
    const game6 = game5.move(RollWith(2, 0));
    not("prompt is not sell", game6.prompt, 'sell');
    is("turn is ok", game6.turns, 3);
    oneevent("bankrupt", game6, 'bankrupt');
    is('game is finished', game6.finished(), true);
  });

}

