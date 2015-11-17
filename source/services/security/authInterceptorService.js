import angular from 'angular';
import 'angular-local-storage';

var app = angular.module('cn.authInterceptor', [ 'LocalStorageModule' ]);
app.factory('authInterceptorService', [
        '$q', '$location', 'localStorageService', 'mediatorService', function($q, $location, localStorageService, mediatorService) {

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

            let _responseError = function(rejection) {
                if (rejection.config.url.indexOf('register') === -1) {
                    if (String(rejection.status).substr(0, 1) === '4') {
                        $location.path('/login');
                    }
                }

                if (!rejection.data) {
                    rejection.data = {
                        error: 'Unknown',
                        error_description: 'Unknown error occurred'
                    };
                } else if (rejection.data.ModelState) {
                    rejection.data = {
                        error: 'Invalid Password',
                        error_description: rejection.data.ModelState[''][0]
                    };
                }

                let errorDetails = {
                    status: rejection.status,
                    statusText: rejection.statusText,
                    error: rejection.data.error,
                    errorDescription: rejection.data.error_description
                };

                mediatorService.notify('ServiceError', errorDetails);
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