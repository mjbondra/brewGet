
var sockjs = require('sockjs')
  , socket = sockjs.createServer();

module.exports = function (server) {
  var connections = [];

  socket.on('connection', function (conn) {
    console.log('connected!');
    connections.push(conn);
    conn.on('data', function (message) {
      console.log(message);
      var i = connections.length;
      while (i--) connections[i].write(message);
    });
    conn.on('close', function () {
      console.log('closed!');
      connections.splice(connections.indexOf(conn), 1);
    });
  });

  socket.installHandlers(server, { prefix:'/socket' });
};
