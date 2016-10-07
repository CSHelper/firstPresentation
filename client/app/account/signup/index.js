'use strict';

import angular from 'angular';
import SignupController from './signup.controller';

export default angular.module('firstPresentationApp.signup', [])
  .controller('SignupController', SignupController)
  .name;
