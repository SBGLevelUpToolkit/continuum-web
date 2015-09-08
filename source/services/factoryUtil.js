import angular from 'angular';
import 'angular-resource';

export default function createResourceFactory(resource) {
    var app = angular.module('cn.' + resource.name + 'Factory', [ 'cn.hostName', 'ngResource' ]);
    app.factory(resource.name + 'Service', [
        'hostName', '$resource', function(hostName, $resource) {
            var serviceBase = hostName + '/api/';
            var fullPath = serviceBase + resource.name + '/';

            return $resource(fullPath + ':' + resource.name, { resource: '@' + resource.name }, {
                query: {
                    method: 'GET', isArray: resource.isArray
                },
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
}