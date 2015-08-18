import angular from 'angular';
import './loginFactory';
import './authFactory';
import './hostNameProvider';

var app = angular.module('Continuum.services', [
    'auth',
    'logins',
    'hostName'
]);

export default app;
