'use strict';

import angular from 'angular';
import './container/container';
import './header/header';
import './home/home';
import './login/login';
import './register/register';
import './goals/goals';
import './teamSelection/teamSelection';
import './assessment/assessment';
import './moderateAssessment/moderateAssessment';
import './dimension/dimension';
import './forgotPassword/forgotPassword';
import './renderComplete/renderComplete';

var app = angular.module('cn.components', [
    'cn.container',
    'cn.header',
    'cn.home',
    'cn.login',
    'cn.register',
    'cn.goals',
    'cn.teamSelection',
    'cn.assessment',
    'cn.moderateAssessment',
    'cn.dimension',
    'cn.forgotPassword',
    'cn.onRenderComplete'
]);

export default app;
