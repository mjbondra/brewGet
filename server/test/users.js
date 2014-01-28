
var app = require('../')
  , mongoose = require('mongoose')
  , port = process.env.PORT || 3000
  , supertest = require('supertest')
  , should = require('should');

var request = supertest('http://localhost:' + port)
  , agent = supertest.agent('http://localhost:' + port);

var User = mongoose.model('User');

var userId, sessionId;

describe('Users & Authentication', function () {

  describe('POST /api/users', function () {
    describe('Invalid parameters', function () {
      it('should return JSON and a 422', function (done) {
        request
          .post('/api/users')
          .send({ username: 'foobar', email: 'foobar', password: 'foobar', birthday: new Date(2000, 0, 1) })
          .expect('Content-Type', /json/)
          .expect(422, done);
      });
      it('should not create document', function (done) {
        User.findOne({ username: 'foobar' }, function (err, user) {
          should.equal(user, null);
          done();
        });
      });
    });
    describe('Valid parameters', function () {
      it('should return JSON and a 201', function (done) {
        agent
          .post('/api/users')
          .send({ username: 'foobar', email: 'foo@bar.com', password: 'foobar', birthday: new Date(1982, 10, 11) })
          .expect('Content-Type', /json/)
          .expect(201, done);
      });
      it('should create document', function (done) {
        User.findOne({ username: 'foobar' }, function (err, user) {
          userId = user.id || null;
          should.notEqual(user, null);
          done();
        });
      });
      it('should serialize user into session', function (done) {
        mongoose.connection.db.collection('sessions').findOne({ blob: { $regex: userId } }, function (err, session) {
          should.notEqual(session, null);
          sessionId = session._id;
          done();
        });
      });
    });
    describe('Duplicate \'username\' parameter', function () {
      it('should return JSON and a 409', function (done) {
        request
          .post('/api/users')
          .send({ username: 'foobar', email: 'foo@bar.com', password: 'foobar', birthday: new Date(1982, 10, 11) })
          .expect('Content-Type', /json/)
          .expect(409, done);
      });
      it('should not create duplicate document', function (done) {
        User.count({ username: 'foobar' }, function (err, count) {
          count.should.equal(1);
          done();
        });
      });
    });
  });

  describe('PUT /api/users/:slug', function () {
    describe('Invalid session (not self)', function () {
      describe('Non-existent user', function () {
        it('should return JSON and a 401', function (done) {
          request
            .put('/api/users/foo')
            .send({ email: 'foobar@foobar.com' })
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
        it('should not create document', function (done) {
          User.findOne({ username: 'foo' }, function (err, user) {
            should.equal(user, null);
            done();
          });
        });
      });
      describe('Valid user (not self), invalid parameters', function () {
        it('should return JSON and a 401', function (done) {
          request
            .put('/api/users/foobar')
            .send({ email: 'foobar' })
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
        it('should not update document', function (done) {
          User.findOne({ username: 'foobar' }, function (err, user) {
            should.notEqual(user.email, 'foobar');
            done();
          });
        });
      });
      describe('valid user (not self), valid parameters', function () {
        it('should return JSON and a 401', function (done) {
          request
            .put('/api/users/foobar')
            .send({ email: 'foo@baz.com' })
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
        it('should not update document', function (done) {
          User.findOne({ username: 'foobar' }, function (err, user) {
            should.notEqual(user.email, 'foo@baz.com');
            done();
          });
        });
      }); 
    });

    describe('Valid session (self)', function () {
      describe('Non-existent/non-session user', function () {
        it('should return JSON and a 401', function (done) {
          agent
            .put('/api/users/foo')
            .send({ email: 'foobar@foobar.com' })
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
        it('should not create document', function (done) {
          User.findOne({ username: 'foo' }, function (err, user) {
            should.equal(user, null);
            done();
          });
        });
      });
      describe('Valid user (self), invalid parameters', function () {
        it('should return JSON and a 422', function (done) {
          agent
            .put('/api/users/foobar')
            .send({ email: 'foobar' })
            .expect('Content-Type', /json/)
            .expect(422, done);
        });
        it('should not update document', function (done) {
          User.findOne({ username: 'foobar' }, function (err, user) {
            should.notEqual(user.email, 'foobar');
            done();
          });
        });
      });
      describe('valid user (self), valid parameters', function () {
        it('should return JSON and a 200', function (done) {
          agent
            .put('/api/users/foobar')
            .send({ email: 'foobar@foobar.com' })
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
        it('should update document', function (done) {
          User.findOne({ username: 'foobar' }, function (err, user) {
            should.equal(user.email, 'foobar@foobar.com');
            done();
          });
        });
      });
    });
  });

  describe('GET /api/users', function () {
    describe('Index', function () {
      it('should return JSON and a 200', function (done) {
        request
          .get('/api/users')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
  });

  describe('GET /api/users/:slug', function () {
    describe('Non-existent user', function () {
      it('should return JSON and a 404', function (done) {
        request
          .get('/api/users/foo')
          .expect('Content-Type', /json/)
          .expect(404, done);
      });
    });
    describe('Valid user', function () {
      it('should return JSON and a 200', function (done) {
        request
          .get('/api/users/foobar')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
  });

  describe('DELETE /api/users/sign-out', function () {
    describe('Sign out', function () {
      it('should return JSON and a 200', function (done) {
        agent
          .del('/api/users/sign-out')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
      it('should remove session document', function (done) {
        var ObjectID = require('mongoose/node_modules/mongodb').ObjectID;
        mongoose.connection.db.collection('sessions').findOne({ _id: sessionId }, function (err, session) {
          should.equal(session, null);
          done();
        });
      });
    });
  });

  describe('POST /api/users/sign-in', function () {
    describe('Missing credentials', function () {
      it('should return JSON and a 422', function (done) {
        agent
          .post('/api/users/sign-in')
          .send({})
          .expect('Content-Type', /json/)
          .expect(422, done);
      });
      it('should not serialize user into session', function (done) {
        mongoose.connection.db.collection('sessions').findOne({ blob: { $regex: 'user' } }, function (err, session) {
          should.equal(session, null);
          done();
        });
      });
    });
    describe('Invalid credentials', function () {
      it('should return JSON and a 401', function (done) {
        agent
          .post('/api/users/sign-in')
          .send({ username: 'foo', password: 'foo' })
          .expect('Content-Type', /json/)
          .expect(401, done);
      });
      it('should not serialize user into session', function (done) {
        mongoose.connection.db.collection('sessions').findOne({ blob: { $regex: 'user' } }, function (err, session) {
          should.equal(session, null);
          done();
        });
      });
    });
    describe('Valid credentials', function () {
      it('should return JSON and a 201', function (done) {
        agent
          .post('/api/users/sign-in')
          .send({ username: 'foobar', password: 'foobar' })
          .expect('Content-Type', /json/)
          .expect(201, done);
      });
      it('should serialize user into session', function (done) {
        mongoose.connection.db.collection('sessions').findOne({ blob: { $regex: userId } }, function (err, session) {
          should.notEqual(session, null);
          sessionId = session._id;
          done();
        });
      });
    });
  });

  describe('DELETE /api/users/:slug', function () {
    describe('Invalid session (not self)', function () {
      describe('Non-existent/non-session user', function () {
        it('should return JSON and a 401', function (done) {
          request
            .del('/api/users/foo')
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
      });
      describe('Valid user (not self)', function () {
        it('should return JSON and a 401', function (done) {
          request
            .del('/api/users/foobar')
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
        it('should not delete document', function (done) {
          User.findOne({ username: 'foobar' }, function (err, user) {
            should.notEqual(user, null);
            done();
          });
        });
      });
    });

    describe('Valid session (self)', function () {
      describe('Non-existent/non-session user', function () {
        it('should return JSON and a 401', function (done) {
          agent
            .del('/api/users/foo')
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
        it('should not remove user from session', function (done) {
          var ObjectID = require('mongoose/node_modules/mongodb').ObjectID;
          mongoose.connection.db.collection('sessions').findOne({ _id: sessionId }, function (err, session) {
            should.notEqual(session.blob, '{}');
            done();
          });
        });
      });
      describe('Valid user (self)', function () {
        it('should return JSON and a 200', function (done) {
          agent
            .del('/api/users/foobar')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
        it('should delete document', function (done) {
          User.findOne({ username: 'foobar' }, function (err, user) {
            should.equal(user, null);
            done();
          });
        });
        it('should remove user from session', function (done) {
          var ObjectID = require('mongoose/node_modules/mongodb').ObjectID;
          mongoose.connection.db.collection('sessions').findOne({ _id: sessionId }, function (err, session) {
            should.equal(session.blob, '{}');
            done();
          });
        });
      });
    });
  });
});
