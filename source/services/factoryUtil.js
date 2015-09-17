import angular from 'angular';
import 'angular-resource';

export default function(resource) {
    var app = angular.module('cn.' + resource.name + 'Factory', [ 'cn.hostName', 'ngResource' ]);
    app.factory(resource.name + 'Service', [
        'hostName', '$resource', function(hostName, $resource) {
            var serviceBase = hostName + '/api/';
            var fullPath = serviceBase + resource.name + '/';
            let resourceOperations = {
                query: {
                    method: 'GET', isArray: resource.isArray
                },
                update: {
                    method: 'PUT'
                }
            };

            if (resource.operations) {
                resourceOperations = Object.assign(resourceOperations, resource.operations(fullPath));
            }

            return $resource(fullPath + ':' + resource.name, { Id: '@Id' }, resourceOperations);
        }
    ]);
}