'use strict';

import angular from 'angular';
import './container/container';
import './header/header';
import './sideNav/sideNav';
import './login/login';
import './registration/register';
import './goals/goals';

var app = angular.module('cn.components', [
    'cn.container',
    'cn.header',
    'cn.sideNav',
    'cn.login',
    'cn.registration',
    'cn.goals'
]);

export default app;
