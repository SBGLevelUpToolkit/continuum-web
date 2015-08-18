import angular from 'angular';
import './loginFactory';
import './hostNameProvider';

var app = angular.module('Continuum.services', [
    'logins',
    'hostName'
]);

export default app;
