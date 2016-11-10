'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './main.routes';

export class MainComponent {
  /*@ngInject*/
  constructor(Auth) {
    'ngInject';

    this.getCurrentUser = Auth.getCurrentUserSync;

    var java = {
      name: 'Java',
      lessons: this.createLessons('Java')
    };

    var c = {
      name: 'C',
      lessons: this.createLessons('C')
    };

    var cpp = {
      name: 'C++',
      lessons: this.createLessons('C++')
    };
    this.encodeURI = encodeURI;
    this.languages = [java, c, cpp];
  }

  createLessons(language) {
    var lessons = [{
      name: language + ' Basics',
      subLessons: [{
        name: 'Introduction to ' + language
      },{
        name: 'Data Types'
      },{
        name: 'Variable Types'
      },{
        name: 'Operators'
      }]
    }, {
      name: 'Conditionals',
      subLessons: [{
        name: 'If Statement'
      }, {
        name: 'If Else Statement'
      }, {
        name: 'Nested If Statement'
      }, {
        name: 'Switch Statement'
      }]
    }, {
      name: 'Loop Statements',
      subLessons: [{
        name: 'While Statement'
      }, {
        name: 'Do While Statement'
      }, {
        name: 'For Statement'
      }]
    }, {
      name: 'Loop Control Statements',
      subLessons: [{
        name: 'Break Statement'
      }, {
        name: 'Continue Statement'
      }]
    }]
    
    return lessons;
  }
}

export default angular.module('firstPresentationApp.main', [uiRouter])
  .config(routes)
  .component('main', {
    template: require('./main.html'),
    controller: MainComponent,
    controllerAs: 'mainCtrl'
  })
  .name;
