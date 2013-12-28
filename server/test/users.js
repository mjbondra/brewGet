
var mongoose = require('mongoose')
  , port = process.env.PORT || 3000
  , request = require('supertest')('http://localhost:' + port)
  , should = require('should');

console.log(port);

var app = require('../');

var User = mongoose.model('User');

describe('Users & Authentication', function () {

  describe('POST /api/users', function () {
    describe('Valid parameters', function () {
      it('should return JSON and a 201', function (done) {
        request
          .post('/api/users')
          .field('username', 'foobar')
          .field('email', 'foo@bar.com')
          .field('password', 'foobar')
          .expect('Content-Type', /json/)
          .expect(201, done);
      });
    });
    describe('Invalid parameters', function () {
      it('should return JSON and a 422', function (done) {
        request
          .post('/api/users')
          .field('username', 'foobar')
          .field('email', '')
          .field('password', 'foobar')
          .expect('Content-Type', /json/)
          .expect(422, done);
      });
    });
    describe('Duplicate \'username\' parameter', function () {
      it('should return JSON and a 409', function (done) {
        request
          .post('/api/users')
          .field('username', 'foobar')
          .field('email', 'foo@bar.com')
          .field('password', 'foobar')
          .expect('Content-Type', /json/)
          .expect(409, done);
      });
    });
  });

  describe('PUT /api/users/:username', function () {
    describe('Valid user, valid parameters', function () {
      it('should return JSON and a 200', function (done) {
        request
          .put('/api/users/foobar')
          .field('email', 'foobar@foobar.com')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
    describe('Valid user, invalid parameters', function () {
      it('should return JSON and a 422', function (done) {
        request
          .put('/api/users/foobar')
          .field('email', 'foobar')
          .expect('Content-Type', /json/)
          .expect(422, done);
      });
    });
    describe('Non-existant user', function () {
      it('should return JSON and a 404', function (done) {
        request
          .put('/api/users/foo')
          .field('email', 'foobar@foobar.com')
          .expect('Content-Type', /json/)
          .expect(404, done);
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

  describe('GET /api/users/:username', function () {
    describe('Valid user', function () {
      it('should return JSON and a 200', function (done) {
        request
          .get('/api/users/foobar')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
    describe('Non-existant user', function () {
      it('should return JSON and a 404', function (done) {
        request
          .get('/api/users/foo')
          .expect('Content-Type', /json/)
          .expect(404, done);
      });
    });
  });

  describe('POST /api/users/sign-in', function () {
    describe('Missing credentials', function () {
      it('should return JSON and a 422', function (done) {
        request
          .post('/api/users/sign-in')
          .field()
          .expect('Content-Type', /json/)
          .expect(422, done);
      });
    });
    describe('Invalid credentials', function () {
      it('should return JSON and a 401', function (done) {
        request
          .post('/api/users/sign-in')
          .field('username', 'foo')
          .field('password', 'foo')
          .expect('Content-Type', /json/)
          .expect(401, done);
      });
    });
    describe('Valid credentials', function () {
      it('should return JSON and a 201', function (done) {
        request
          .post('/api/users/sign-in')
          .field('username', 'foobar')
          .field('password', 'foobar')
          .expect('Content-Type', /json/)
          .expect(201, done);
      });
    });
  });

  describe('DELETE /api/users/sign-out', function () {
    describe('Sign out', function () {
      it('should return JSON and a 200', function (done) {
        request
          .del('/api/users/sign-out')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
  });

  describe('DELETE /api/users/:username', function () {
    describe('Valid user', function () {
      it('should return JSON and a 200', function (done) {
        request
          .del('/api/users/foobar')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
    describe('Non-existant user', function () {
      it('should return JSON and a 404', function (done) {
        request
          .del('/api/users/foobar')
          .expect('Content-Type', /json/)
          .expect(404, done);
      });
    });
  });

});
