'use strict';

import angular from 'angular';
import './container/container';
import './header/header';
import './login/login';
import './register/register';
import './goals/goals';
import './teamSelection/teamSelection';
import './assessment/assessment';
import './forgotPassword/forgotPassword';
import './repeat';

var app = angular.module('cn.components', [
    'cn.container',
    'cn.header',
    'cn.login',
    'cn.register',
    'cn.goals',
    'cn.teamSelection',
    'cn.assessment',
    'cn.forgotPassword',
    'cn.repeat'
]);

export default app;
