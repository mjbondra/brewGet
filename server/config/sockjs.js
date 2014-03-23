
var mongoose = require('mongoose')
  , sockjs = require('sockjs')
  , socket = sockjs.createServer();

module.exports = function (server, sockJSEmitter) {
  var connections = {
    chat: [],
    global: []
  };

  sockJSEmitter.on('context.close', function (conn, context) {
    if (context && connections[context] && connections[context].indexOf(conn) >= 0) connections[context].splice(connections[context].indexOf(conn), 1);
  });
  sockJSEmitter.on('context.open', function (conn, context) {
    console.log(context);
    if (context && connections[context] && connections[context].indexOf(conn) < 0) connections[context].push(conn);
  });
  sockJSEmitter.on('message', function (message, context) {
    if (!context || !connections[context]) return;
    var i = connections[context].length;
    while (i--) connections[context][i].write(message);
  });

  socket.on('connection', function (conn) {
    connections.global.push(conn);
    conn.on('data', function (data) {
      console.log(data);
      try {
        var dataObj = JSON.parse(data);
        if (dataObj.action === 'open') sockJSEmitter.emit('context.open', conn, dataObj.context);
        else if (dataObj.action === 'post') sockJSEmitter.emit('message', data, dataObj.context);
      } catch (err) {}
    });
    conn.on('close', function () {
      connections.global.splice(connections.global.indexOf(conn), 1);
    });
  });

  socket.installHandlers(server, { prefix:'/socket' });
};
