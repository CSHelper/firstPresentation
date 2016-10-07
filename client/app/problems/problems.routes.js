'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('problems', {
      url: '/problems?language&lesson',
      template: '<problems></problems>'
    });
}
