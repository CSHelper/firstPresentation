'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('problems', {
      url: '/problems?id',
      template: '<problems></problems>',
      //authenticate: 'user'
    });
}
