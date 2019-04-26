require("./index.css");
const main = require('./main');
const server = require('./server');
const socket = require('./socket');

module.exports = main.app;
module.exports.Server = server.Server;
module.exports.Socket = socket.Socket;
