import angular from 'angular';
import 'angular-resource';
import 'angular-local-storage';
import '../hostNameProvider';

var app = angular.module('cn.auth', [ 'cn.hostName', 'LocalStorageModule' ]);
app.factory('authService', [
    '$http', '$q', 'localStorageService', 'hostName', function($http, $q, localStorageService, hostName, authInterceptorService) {

        var serviceBase = hostName + '/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: ''
        };

        var _saveRegistration = function(registration) {

            //_logOut();

            return $http.post(serviceBase + 'api/account/register', registration).then(function(response) {
                return response;
            });
        };

        var _login = function(loginData) {

            var data = 'grant_type=password&username=' + loginData.userName + '&password=' + loginData.password;

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .success(function(response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;

                    deferred.resolve(response);

                }).error(function(err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _logOut = function() {
            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = '';

        };

        var _confirmEmail = function(userId, code) {
            return $http.post(
                `${serviceBase}api/account/ConfirmEmail?userId=${userId}&code=${code}`).then(function(response) {
                return response;
            });
        };

        var _resetPassword = function(userId, code) {
            return $http.post(
                `${serviceBase}api/account/ResetPassword?emailAddress=${userId}`).then(function(response) {
                return response;
            });
        };

        var _confirmResetPassword = function(userId, code, password) {
            return $http.post(
                `${serviceBase}api/account/ConfirmResetPassword?emailAddress=${userId}&code=${code}&password=${password}`)
                .then(function(response) {
                    return response;
                });
        };

        var _fillAuthData = function() {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            }
        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.confirmEmail = _confirmEmail;
        authServiceFactory.resetPassword = _resetPassword;
        authServiceFactory.confirmResetPassword = _confirmResetPassword;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }
]);

export default app;