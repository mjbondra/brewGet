
var sockjs = require('sockjs')
  , socket = sockjs.createServer();

module.exports = function (server) {
  var connections = [];

  socket.on('connection', function (conn) {
    connections.push(conn);
    conn.on('data', function (message) {
      conn.write(message);
    });
    conn.on('close', function () {
      connections.splice(connections.indexOf(conn), 1);
    });
  });
  
  socket.installHandlers(server, { prefix:'/socket' });
};
