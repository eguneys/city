export function Socket(handlers) {
  // https://stackoverflow.com/questions/55860172/how-to-sequence-varying-function-calls-with-promises-with-a-queue
  var lastProm = Promise.resolve();

  this.push = (msg) => {

    lastProm = lastProm.then(() => {
      var handler = handlers[msg.t];
      if (handler) return handler(msg.d);
      return Promise.resolve();
    });
    return lastProm;
  };

};
