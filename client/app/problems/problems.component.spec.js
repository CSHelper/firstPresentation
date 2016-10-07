'use strict';

describe('Component: ProblemsComponent', function() {
  // load the controller's module
  beforeEach(module('firstPresentationApp.problems'));

  var ProblemsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ProblemsComponent = $componentController('problems', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
