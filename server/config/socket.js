
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , net = require('net')
  , Promise = require('bluebird');

var Session = mongoose.model('SessionStore')
  , User = mongoose.model('User');

/**
 * Helper functions
 */
var user_compact = function (user) {};

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
  socketEmitter.on('connection.id', function (sid, cid) {});
  socketEmitter.on('session.find', function (sid, cid) {
    Promise.promisify(Session.findOne, Session)({ sid: 'koa:sess:' + sid }).then(function (session) {
      if (!session || !session.blob) return;
      session = JSON.parse(session.blob);
      return Promise.promisify(User.findById, User)(session.user, { images: 1, slug: 1, username: 1, location: 1 });
    }).then(function (user) {
      if (!user) return client.write(JSON.stringify({
        cid: cid,
        event: 'session.populate',
        sid: sid
      }));
      var images = []
        , location = '';
      user = user._doc;
      if (user.images && user.images.length > 0) {
        var i = user.images.length;
        while (i--) if (user.images[i].geometry.width === 50 || user.images[i].geometry.width === 100) images.push({
          geometry: user.images[i].geometry,
          src: user.images[i].src
        });
      }
      if (user.location && user.location.country && user.location.country.name === 'United States') {
        if (user.location.state && user.location.state.abbreviation) {
          if (user.location.city && user.location.city.name) location = user.location.city.name + ', ' + user.location.state.abbreviation;
          else if (user.location.state.name) location = user.location.state.name;
          else location = user.location.state.abbreviation;
        } else if (user.location.city && user.location.city.name) location = user.location.city.name;
        else if (user.location.name) location = user.location.name;
      }
      else if (user.location && user.location.name) location = user.location.name;
      user.images = images;
      user.location = location;
      client.write(JSON.stringify({
        cid: cid,
        event: 'session.populate',
        sid: sid,
        user: user
      }));
    }).fail(function (err) {
      console.error(err);
    });
  });
  socketEmitter.on('session.update', function (sid, session) {
    if (!sid) return;
    console.log(sid);
    // client.write(JSON.stringify({
    //
    // }));
  });


  client.on('data', function (data) {
    try {
      var dataObj = JSON.parse(data);
      if (dataObj.event === 'console.log') console.log(dataObj.message);
      else if (dataObj.event === 'session.find') socketEmitter.emit('session.find', dataObj.sid, dataObj.cid);
    } catch (err) {}
  });
  client.on('end', function () {
    console.log('client disconnected from TCP server');
  });
};
