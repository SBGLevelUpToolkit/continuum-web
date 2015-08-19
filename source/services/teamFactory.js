import angular from 'angular';
import 'angular-resource';
import 'angular-local-storage';
import './hostNameProvider';

var app = angular.module('cn.team', [ 'cn.hostName' ]);
app.factory('teamService', [
    '$http', '$q', 'hostName', function($http, $q, hostName) {

        var serviceBase = hostName + '/';
        var teamServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: ''
        };

        var _getTeams = function() {

            var deferred = $q.defer();

            $http.get(serviceBase + 'api/team').success(function(response) {
                deferred.resolve(response);
            }).error(function(err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _createTeam = function(team) {

            var deferred = $q.defer();

            $http.put(serviceBase + 'api/team', team).success(function(response) {
                deferred.resolve(response);
            }).error(function(err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _updateTeam = function(team) {

            var deferred = $q.defer();

            $http.post(serviceBase + 'api/team', team)
                .success(function(response) {

                    deferred.resolve(response);

                }).error(function(err, status) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };

        var _deleteTeam = function(team) {

            var deferred = $q.defer();

            $http.delete(serviceBase + 'api/team', team)
                .success(function(response) {

                    deferred.resolve(response);

                }).error(function(err, status) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };

        teamServiceFactory.getTeams = _getTeams;
        teamServiceFactory.createTeam = _createTeam;
        teamServiceFactory.updateTeam = _updateTeam;
        teamServiceFactory.deleteTeam = _deleteTeam;

        return teamServiceFactory;
    }
]);

export default app;