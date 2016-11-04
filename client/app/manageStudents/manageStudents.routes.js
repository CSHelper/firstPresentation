'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('manageStudents', {
      url: '/manageStudents',
      template: '<manage-students></manage-students>'
    });
}
