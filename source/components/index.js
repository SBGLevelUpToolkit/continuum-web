'use strict';

import angular from 'angular';
import './container/container';
import './header/header';
import './sideNav/sideNav';
import './login/login';
import './register/register';
import './goals/goals';
import './teamSelection/teamSelection';
import './assessment/assessment';

var app = angular.module('cn.components', [
    'cn.container',
    'cn.header',
    'cn.sideNav',
    'cn.login',
    'cn.register',
    'cn.goals',
    'cn.teamSelection',
    'cn.assessment'
]);

export default app;
