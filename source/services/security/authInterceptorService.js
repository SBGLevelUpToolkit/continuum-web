import angular from 'angular';
import 'angular-local-storage';

var app = angular.module('cn.authInterceptor', [ 'LocalStorageModule' ]);
app.factory('authInterceptorService', [
        '$q', '$location', 'localStorageService', function($q, $location, localStorageService) {

            var authInterceptorServiceFactory = {};

            var _request = function(config) {
                if (config.url.indexOf('token') === -1) {
                    config.headers = config.headers || {};

                    var authData = localStorageService.get('authorizationData');
                    if (authData) {
                        config.headers.Authorization = 'Bearer ' + authData.token;
                    }
                }

                return config;
            };

            var _responseError = function(rejection) {
                if (String(rejection.status).substr(0, 1) === '4') {
                    $location.path('/login');
                }
                return $q.reject(rejection);
            };

            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.responseError = _responseError;

            return authInterceptorServiceFactory;
        }
    ])
    .config([
        '$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        }
    ]);

export default app;