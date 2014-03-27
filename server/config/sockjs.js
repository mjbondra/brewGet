
var mongoose = require('mongoose')
  , sockjs = require('sockjs')
  , socket = sockjs.createServer()
  , _ = require('underscore');

/**
 * Socket connection model
 */
var Schema = mongoose.Schema
  , ConnectionSchema = new Schema({
    connection: Schema.Types.Mixed
  }), Connection = mongoose.model('SocketConnection', ConnectionSchema);


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
    var connection = new Connection({ connection: conn });
    connection.save(function (err) {
      console.log(err);
    });
    conn.on('data', function (data) {
      try {
        var dataObj = JSON.parse(data);
        if (dataObj.action === 'open') sockJSEmitter.emit('context.open', conn, dataObj.context);
        else if (dataObj.action === 'post') sockJSEmitter.emit('message', data, dataObj.context);
      } catch (err) {}
    });
    conn.on('close', function () {
      Connection.findOneAndRemove({ connection: conn });
      var keys = Object.keys(connections)
        , i = keys.length;
      while (i--) if (connections[keys[i]] && connections[keys[i]].indexOf(conn) >= 0) connections[keys[i]].splice(connections[keys[i]].indexOf(conn), 1);
    });
  });

  socket.installHandlers(server, { prefix:'/socket' });
};
