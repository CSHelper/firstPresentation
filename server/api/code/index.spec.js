'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var codeCtrlStub = {
  index: 'codeCtrl.index',
  show: 'codeCtrl.show',
  create: 'codeCtrl.create',
  upsert: 'codeCtrl.upsert',
  patch: 'codeCtrl.patch',
  destroy: 'codeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var codeIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './code.controller': codeCtrlStub
});

describe('Code API Router:', function() {
  it('should return an express router instance', function() {
    expect(codeIndex).to.equal(routerStub);
  });

  describe('GET /api/codes', function() {
    it('should route to code.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'codeCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/codes/:id', function() {
    it('should route to code.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'codeCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/codes', function() {
    it('should route to code.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'codeCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/codes/:id', function() {
    it('should route to code.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'codeCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/codes/:id', function() {
    it('should route to code.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'codeCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/codes/:id', function() {
    it('should route to code.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'codeCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
