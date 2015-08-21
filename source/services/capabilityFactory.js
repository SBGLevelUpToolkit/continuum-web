import angular from 'angular';
import 'angular-resource';
import 'angular-local-storage';
import './hostNameProvider';

var app = angular.module('cn.capabilityFactory', [ 'cn.hostName', 'ngResource' ]);
app.factory('capabilityService', [
    'hostName', '$resource', function(hostName, $resource) {
        var serviceBase = hostName + '/api/';
        var resource = "capability";
        var fullPath = serviceBase + resource + '/';

        return $resource(fullPath + ':' + resource, { resource: "@" + resource });
    }
]);

function createResourceFactory(module, resource) {
    var app = angular.module('cn.' + resource + 'Factory', [ 'cn.hostName', 'ngResource' ]);
    app.factory(resource + 'Service', [
        'hostName', '$resource', function(hostName, $resource) {
            var serviceBase = hostName + '/api/';
            var fullPath = serviceBase + resource + '/';

            return $resource(fullPath + ':' + resource, { resource: "@" + resource });
        }
    ]);
}

export default app;