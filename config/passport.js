
/**
 * Module dependencies
 */
var mongoose = require('mongoose')
  , msg = require('./messages').authentication
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User');

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  /** use local strategy */
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: msg.incorrect.user(username) });
        if (!user.authenticate(password, user.salt)) return done(null, false, { message: msg.incorrect.password });
        return done(null, user);
      });
    }
  ));
}
