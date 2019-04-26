export function Socket(handlers) {
  // https://stackoverflow.com/questions/55860172/how-to-sequence-varying-function-calls-with-promises-with-a-queue
  var lastProm = Promise.resolve();

  this.push = (msg) => {

    lastProm = lastProm.then(() => {
      return handlers[msg.t](msg.d);
    });
    return lastProm;
  };

};
