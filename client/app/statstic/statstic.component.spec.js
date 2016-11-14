'use strict';

describe('Component: StatsticComponent', function() {
  // load the controller's module
  beforeEach(module('firstPresentationApp.statstic'));

  var StatsticComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    StatsticComponent = $componentController('statstic', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
