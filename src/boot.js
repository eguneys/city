require("./index.css");
const main = require('./main');
const server = require('./server');

module.exports = main.app;
module.exports.Server = server.Server;
