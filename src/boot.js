require("./colors.css");
require("./index.css");
const main = require('./main');
const socket = require('./socket');
const server = require('./server/server');
const tests = require('./server/tests');

module.exports = main.app;
module.exports.Server = server.Server;
module.exports.Socket = socket.Socket;
module.exports.Tests = tests.Tests;
