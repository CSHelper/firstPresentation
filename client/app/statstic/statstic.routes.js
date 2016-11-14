'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('statstic', {
      url: '/statstic',
      template: '<statstic></statstic>'
    });
}
