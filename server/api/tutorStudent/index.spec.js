'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var tutorStudentCtrlStub = {
  index: 'tutorStudentCtrl.index',
  show: 'tutorStudentCtrl.show',
  create: 'tutorStudentCtrl.create',
  upsert: 'tutorStudentCtrl.upsert',
  patch: 'tutorStudentCtrl.patch',
  destroy: 'tutorStudentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var tutorStudentIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './tutorStudent.controller': tutorStudentCtrlStub
});

describe('TutorStudent API Router:', function() {
  it('should return an express router instance', function() {
    expect(tutorStudentIndex).to.equal(routerStub);
  });

  describe('GET /api/tutorStudents', function() {
    it('should route to tutorStudent.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'tutorStudentCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/tutorStudents/:id', function() {
    it('should route to tutorStudent.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'tutorStudentCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/tutorStudents', function() {
    it('should route to tutorStudent.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'tutorStudentCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/tutorStudents/:id', function() {
    it('should route to tutorStudent.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'tutorStudentCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/tutorStudents/:id', function() {
    it('should route to tutorStudent.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'tutorStudentCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/tutorStudents/:id', function() {
    it('should route to tutorStudent.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'tutorStudentCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
