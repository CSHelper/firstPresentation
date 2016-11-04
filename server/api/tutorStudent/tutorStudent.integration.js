'use strict';

var app = require('../..');
import request from 'supertest';

var newTutorStudent;

describe('TutorStudent API:', function() {
  describe('GET /api/tutorStudents', function() {
    var tutorStudents;

    beforeEach(function(done) {
      request(app)
        .get('/api/tutorStudents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          tutorStudents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(tutorStudents).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/tutorStudents', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/tutorStudents')
        .send({
          name: 'New TutorStudent',
          info: 'This is the brand new tutorStudent!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newTutorStudent = res.body;
          done();
        });
    });

    it('should respond with the newly created tutorStudent', function() {
      expect(newTutorStudent.name).to.equal('New TutorStudent');
      expect(newTutorStudent.info).to.equal('This is the brand new tutorStudent!!!');
    });
  });

  describe('GET /api/tutorStudents/:id', function() {
    var tutorStudent;

    beforeEach(function(done) {
      request(app)
        .get(`/api/tutorStudents/${newTutorStudent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          tutorStudent = res.body;
          done();
        });
    });

    afterEach(function() {
      tutorStudent = {};
    });

    it('should respond with the requested tutorStudent', function() {
      expect(tutorStudent.name).to.equal('New TutorStudent');
      expect(tutorStudent.info).to.equal('This is the brand new tutorStudent!!!');
    });
  });

  describe('PUT /api/tutorStudents/:id', function() {
    var updatedTutorStudent;

    beforeEach(function(done) {
      request(app)
        .put(`/api/tutorStudents/${newTutorStudent._id}`)
        .send({
          name: 'Updated TutorStudent',
          info: 'This is the updated tutorStudent!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedTutorStudent = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTutorStudent = {};
    });

    it('should respond with the original tutorStudent', function() {
      expect(updatedTutorStudent.name).to.equal('New TutorStudent');
      expect(updatedTutorStudent.info).to.equal('This is the brand new tutorStudent!!!');
    });

    it('should respond with the updated tutorStudent on a subsequent GET', function(done) {
      request(app)
        .get(`/api/tutorStudents/${newTutorStudent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let tutorStudent = res.body;

          expect(tutorStudent.name).to.equal('Updated TutorStudent');
          expect(tutorStudent.info).to.equal('This is the updated tutorStudent!!!');

          done();
        });
    });
  });

  describe('PATCH /api/tutorStudents/:id', function() {
    var patchedTutorStudent;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/tutorStudents/${newTutorStudent._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched TutorStudent' },
          { op: 'replace', path: '/info', value: 'This is the patched tutorStudent!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedTutorStudent = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedTutorStudent = {};
    });

    it('should respond with the patched tutorStudent', function() {
      expect(patchedTutorStudent.name).to.equal('Patched TutorStudent');
      expect(patchedTutorStudent.info).to.equal('This is the patched tutorStudent!!!');
    });
  });

  describe('DELETE /api/tutorStudents/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/tutorStudents/${newTutorStudent._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when tutorStudent does not exist', function(done) {
      request(app)
        .delete(`/api/tutorStudents/${newTutorStudent._id}`)
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
