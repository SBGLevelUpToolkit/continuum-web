import angular from 'angular';
import 'angular-resource';
import HostNameService from './hostNameProvider';

var app = angular.module('logins', [ 'ngResource', 'hostName' ]);
app.factory('login', function($resource, hostName, transformRequestAsFormPost) {
    return $resource(hostName + '/token');
    //return $resource(hostName + '/token', {},
    //    {
    //        //'save': { method: 'POST', transformRequest: transformRequestAsFormPost }
    //    });
});

export default app;