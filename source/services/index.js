import angular from 'angular';
import './security/authInterceptorService';
import './hostNameProvider';
import './security/authFactory';
import './createFactories';
import './mediator';

var app = angular.module('cn.services', [
    'cn.authInterceptor',
    'cn.hostName',
    'cn.auth',
    'cn.teamFactory',
    'cn.assessmentFactory',
    'cn.dimensionFactory',
    'cn.userFactory',
    'cn.mediatorFactory'
]);

export default app;
