import angular from 'angular';
import 'angular-resource';
import HostNameService from './hostNameProvider';

var app = angular.module('logins', [ 'ngResource', 'hostName' ]);
app.factory('login', function($resource, hostName) {

    return $resource(hostName + '/continuum/user/auth');
});

export default app;