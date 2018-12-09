
export function tileNeighbors(from, to, by = 1, mod = 24) {
  var result = [];

  while (from !== to) {
    from += by;

    from = (from + mod) % mod;

    result.push(from);
  }

  return result;
}


function test() {
  function log(x, y, by = 1) {
    console.log(by, x, y, tileNeighbors(x, y, by));
  }

  log(0, 1);
  log(0, 10);
  log(22, 0);
  log(23, 4);

  log(0, 1, -1);
  log(23, 22, -1);

}

// test();
