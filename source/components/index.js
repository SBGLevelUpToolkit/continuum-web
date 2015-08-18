'use strict';

import angular from 'angular';
import './container/container';
import './login/login';
import './header/header';
import './sideNav/sideNav';

var app = angular.module('Continuum.components', [
    'cnContainer',
    'cnLogin',
    'cnHeader',
    'cnSideNav'
]);

export default app;
