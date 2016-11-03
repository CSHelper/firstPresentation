'use strict';

describe('Component: ManageStudentsComponent', function() {
  // load the controller's module
  beforeEach(module('firstPresentationApp.manageStudents'));

  var ManageStudentsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ManageStudentsComponent = $componentController('manageStudents', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
