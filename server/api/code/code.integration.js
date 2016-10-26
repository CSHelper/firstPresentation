'use strict';

var app = require('../..');
import request from 'supertest';

var newCode;

describe('Code API:', function() {
  describe('GET /api/codes', function() {
    var codes;

    beforeEach(function(done) {
      request(app)
        .get('/api/codes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          codes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(codes).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/codes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/codes')
        .send({
          name: 'New Code',
          info: 'This is the brand new code!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCode = res.body;
          done();
        });
    });

    it('should respond with the newly created code', function() {
      expect(newCode.name).to.equal('New Code');
      expect(newCode.info).to.equal('This is the brand new code!!!');
    });
  });

  describe('GET /api/codes/:id', function() {
    var code;

    beforeEach(function(done) {
      request(app)
        .get(`/api/codes/${newCode._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          code = res.body;
          done();
        });
    });

    afterEach(function() {
      code = {};
    });

    it('should respond with the requested code', function() {
      expect(code.name).to.equal('New Code');
      expect(code.info).to.equal('This is the brand new code!!!');
    });
  });

  describe('PUT /api/codes/:id', function() {
    var updatedCode;

    beforeEach(function(done) {
      request(app)
        .put(`/api/codes/${newCode._id}`)
        .send({
          name: 'Updated Code',
          info: 'This is the updated code!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCode = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCode = {};
    });

    it('should respond with the original code', function() {
      expect(updatedCode.name).to.equal('New Code');
      expect(updatedCode.info).to.equal('This is the brand new code!!!');
    });

    it('should respond with the updated code on a subsequent GET', function(done) {
      request(app)
        .get(`/api/codes/${newCode._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let code = res.body;

          expect(code.name).to.equal('Updated Code');
          expect(code.info).to.equal('This is the updated code!!!');

          done();
        });
    });
  });

  describe('PATCH /api/codes/:id', function() {
    var patchedCode;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/codes/${newCode._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Code' },
          { op: 'replace', path: '/info', value: 'This is the patched code!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCode = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCode = {};
    });

    it('should respond with the patched code', function() {
      expect(patchedCode.name).to.equal('Patched Code');
      expect(patchedCode.info).to.equal('This is the patched code!!!');
    });
  });

  describe('DELETE /api/codes/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/codes/${newCode._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when code does not exist', function(done) {
      request(app)
        .delete(`/api/codes/${newCode._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
