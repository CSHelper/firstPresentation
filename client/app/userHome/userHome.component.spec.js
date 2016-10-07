'use strict';

describe('Component: UserHomeComponent', function() {
  // load the controller's module
  beforeEach(module('firstPresentationApp.userHome'));

  var UserHomeComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    UserHomeComponent = $componentController('userHome', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
