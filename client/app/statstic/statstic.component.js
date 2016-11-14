'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './statstic.routes';

export class StatsticComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('firstPresentationApp.statstic', [uiRouter])
  .config(routes)
  .component('statstic', {
    template: require('./statstic.html'),
    controller: StatsticComponent,
    controllerAs: 'statsticCtrl'
  })
  .name;
