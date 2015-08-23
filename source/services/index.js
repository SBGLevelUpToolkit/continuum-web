import angular from 'angular';
import './security/authInterceptorService';
import './hostNameProvider';
import './security/authFactory';
import './createFactories'

var app = angular.module('cn.services', [
    'cn.authInterceptor',
    'cn.hostName',
    'cn.auth',
    'cn.teamFactory',
    'cn.assessmentFactory',
    'cn.dimensionFactory',
    'cn.capabilityFactory'
]);

export default app;
