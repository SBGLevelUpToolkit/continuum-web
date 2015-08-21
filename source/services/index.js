import angular from 'angular';
import './authInterceptorService';
import './hostNameProvider';

import './authFactory';
//import './teamFactory';
//import './assessmentFactory';
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
