import angular from 'angular';
import 'angular-resource';

export default function createResourceFactory(resource) {
    var app = angular.module('cn.' + resource + 'Factory', [ 'cn.hostName', 'ngResource' ]);
    app.factory(resource + 'Service', [
        'hostName', '$resource', function(hostName, $resource) {
            var serviceBase = hostName + '/api/';
            var fullPath = serviceBase + resource + '/';

            return $resource(fullPath + ':' + resource, { resource: "@" + resource });
        }
    ]);
};