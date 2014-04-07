
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , net = require('net')
  , Promise = require('bluebird')
  , _ = require('underscore');

var Session = mongoose.model('SessionStore')
  , User = mongoose.model('User');

/*------------------------------------*\
    HELPER FUNCTIONS
\*------------------------------------*/

/**
 * flatten user objects to contain only essential data
 *
 * @param {object} user - complete user object
 * @returns {oject} - flattened user object
 */
var userCompact = function (user) {
  var images = []
    , location = '';
  user = _.pick(user._doc || user, ['_id', 'images', 'location', 'slug', 'username']);
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
  return user;
};

/*------------------------------------*\
    SOCKET CLIENT
\*------------------------------------*/

var client = net.connect({ port: 4001 }, function () {
  client.write(JSON.stringify({
    event: 'console.log',
    message: 'TCP client connected on port ' + ( process.env.PORT || 3000 )
  }));
});

/*------------------------------------*\
    EVENTS
\*------------------------------------*/

module.exports = function (socketEmitter) {

  /** Events of internal origin */

  /**
   * Update session in web socket connection metadata through tcp socket
   */
  socketEmitter.on('connection.session.update', function (sid, session) {
    if (!sid || !session || !session.connections || session.connections.length === 0) return;
    var _session = {
      event: 'connection.session.add',
      sid: sid
    };
    if (typeof session.user === 'object') _session.user = userCompact(session.user);
    else _session.user = {};
    var i = session.connections.length;
    setInterval(function() { // update all connections, but with slight delay between updates
      if (i-- === 0) return clearInterval(this);
      _session.cid = session.connections[i];
      client.write(JSON.stringify(_session));
    }, 100);
  });

  /**
   * Add web socket connection id to session; write session info to web socket connection metadata through tcp socket
   */
  socketEmitter.on('session.connection.add', function (sid, cid) {
    if (!sid || !cid) return;
    var _session = {
      cid: cid,
      event: 'connection.session.add'
    };
    Promise.promisify(Session.findOne, Session)({ sid: 'koa:sess:' + sid }).then(function (session) {
      if (!session || !session.blob) return;
      _session.sid = sid;
      var blob = JSON.parse(session.blob);
      if (!blob.connections) blob.connections = [];
      blob.connections.push(cid);
      session.blob = JSON.stringify(blob);
      session.updatedAt = new Date();
      session.save();
      return Promise.promisify(User.findById, User)(blob.user, { images: 1, slug: 1, username: 1, location: 1 });
    }).then(function (user) {
      if (user) _session.user = userCompact(user);
      client.write(JSON.stringify(_session));
    }).fail(function (err) {
      console.error(err.stack || err);
    });
  });

  /**
   * Remove web socket connection id from session
   */
  socketEmitter.on('session.connection.remove', function (sid, cid) {
    if (!sid || !cid) return;
    Promise.promisify(Session.findOne, Session)({ sid: 'koa:sess:' + sid }).then(function (session) {
      if (!session || !session.blob) return;
      var blob = JSON.parse(session.blob);
      if (!blob.connections || blob.connections.indexOf(cid) < 0) return;
      blob.connections.splice(blob.connections.indexOf(cid), 1);
      session.blob = JSON.stringify(blob);
      session.updatedAt = new Date();
      session.save();
    }).fail(function (err) {
      console.error(err.stack || err);
    });
  });

  /**
   * Error handler
   */
  socketEmitter.on('error', function  (err) {
    console.error(err.stack || err);
  });

  /** Events of external origin */

  /**
   * Data from TCP server
   */
  client.on('data', function (data) {
    try {
      var dataObj = JSON.parse(data);
      if (dataObj.event === 'console.log') console.log(dataObj.message);
      else if (dataObj.event === 'session.connection.add') socketEmitter.emit('session.connection.add', dataObj.sid, dataObj.cid);
      else if (dataObj.event === 'session.connection.remove') socketEmitter.emit('session.connection.remove', dataObj.sid, dataObj.cid);
    } catch (err) {}
  });

  /**
   * Connection closed between TCP client and server
   */
  client.on('end', function () {
    console.log('client disconnected from TCP server');
  });

  /**
   * Error handler
   */
  client.on('error', function (err) {
    console.error(err.stack || err);
  });
};
