// require("./colors.css");
// require("./index.css");
const main = require('./main');
const socket = require('./socket');
const server = require('./server/server');
const game = require('./server/game');
const tests = require('./server/tests');

module.exports = main.app;
module.exports.City = main.app;
module.exports.Server = server.Server;
module.exports.Game = game.Game;
module.exports.Socket = socket.Socket;
module.exports.Tests = tests.Tests;
