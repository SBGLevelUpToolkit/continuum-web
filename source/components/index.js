'use strict';

import angular from 'angular';
import './container/container';
import './header/header';
import './home/home';
import './login/login';
import './register/register';
import './confirmation/confirmation';
import './goals/goals';
import './goals/createGoalDialog';
import './teamSelection/teamSelection';
import './assessment/assessment';
import './moderateAssessment/moderateAssessment';
import './dimension/dimension';
import './forgotPassword/forgotPassword';
import './resetPassword/resetPassword';
import './renderComplete/renderComplete';
import './matchPassword/matchPassword';
import './error/error';

var app = angular.module('cn.components', [
    'cn.container',
    'cn.header',
    'cn.home',
    'cn.login',
    'cn.register',
    'cn.confirmation',
    'cn.goals',
    'cn.createGoalDialog',
    'cn.teamSelection',
    'cn.assessment',
    'cn.moderateAssessment',
    'cn.dimension',
    'cn.forgotPassword',
    'cn.resetPassword',
    'cn.onRenderComplete',
    'cn.matchPassword',
    'cn.error'
]);

export default app;
