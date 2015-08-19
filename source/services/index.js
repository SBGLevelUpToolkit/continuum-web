import angular from 'angular';
import './authInterceptorService';
import './hostNameProvider';

import './authFactory';
import './teamFactory';

var app = angular.module('cn.services', [
    'cn.authInterceptor',
    'cn.hostName',
    'cn.auth',
    'cn.team',
]);

export default app;
