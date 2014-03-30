
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , net = require('net')
  , Promise = require('bluebird');

var Session = mongoose.model('SessionStore')
  , User = mongoose.model('User');

/**
 * Web socket client
 */
var client = net.connect({ port: 4001 }, function () {
  client.write(JSON.stringify({
    event: 'console.log',
    message: 'TCP client connected on port ' + ( process.env.PORT || 3000 )
  }));
});

/**
 * Events
 */
module.exports = function (socketEmitter) {
  socketEmitter.on('session.find', function (cid, sid) {
    Promise.promisify(Session.findOne, Session)({ sid: 'koa:sess:' + sid }).then(function (session) {
      if (!session || !session.blob) return;
      session = JSON.parse(session.blob);
      return Promise.promisify(User.findById, User)(session.user);
    }).then(function (user) {
      if (!user) return;
      client.write(JSON.stringify(user._doc));
    }).fail(function (err) {
      console.error(err);
    });

    // Session.findOne({ sid: sid });
  });

  client.on('data', function (data) {
    try {
      var dataObj = JSON.parse(data);
      if (dataObj.event === 'console.log') console.log(dataObj.message);
      else if (dataObj.event === 'session.find') socketEmitter.emit('session.find', dataObj.cid, dataObj.sid);
    } catch (err) {}
  });
  client.on('end', function () {
    console.log('client disconnected from TCP server');
  });
};
