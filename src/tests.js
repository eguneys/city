import { makeGame, Game } from './server/game';
import { Buy, Nobuyland, Roll, RollWith } from './server/move';

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

}

function withGame(f) {
  return f(makeGame());
}

const not = runtest((a, b) => a !== b);

const is = runtest((a, b) => a === b);

const isabove = runtest((a, b) => a >= b);

const deep_is = runtest((a, b) => {
  if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') return objectCompare(a, b);
  else return a === b;
});

function runtest(matcher) {
  return function(msg, a, b) {
    var passfail = '';
    var res = '';
    var colorcode;
    if (matcher(a, b)) {
      passfail = '%cpass';
      colorcode = 'background: green;';
    } else {
      passfail = '%cfail ';
      colorcode = 'background: red;';
      res += JSON.stringify(a) + ' | ' + JSON.stringify(b);
    }
    res += ' ' + msg;
    console.log(passfail, colorcode,res);  
  };
}

function log(msg) {
  console.log('%c ## ', 'background: yellow;', msg);
}

function objectCompare(obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!objectCompare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};
