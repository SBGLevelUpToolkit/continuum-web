import angular from 'angular';
import 'angular-resource';
import 'angular-local-storage';
import './hostNameProvider';

var app = angular.module('cn.assessmentFactory', [ 'cn.hostName' ]);
app.factory('assessmentService', [
    '$http', '$q', 'hostName', function($http, $q, hostName) {

        var serviceBase = hostName + '/';
        var assessmentServiceFactory = {};

        var _getAssessment = function() {

            var deferred = $q.defer();

            $http.get(serviceBase + 'api/assessment').success(function(response) {
                deferred.resolve(response);
            }).error(function(err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _createAssessment = function(team) {

            var deferred = $q.defer();

            $http.put(serviceBase + 'api/assessment', team).success(function(response) {
                deferred.resolve(response);
            }).error(function(err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var _updateAssessment = function(team) {

            var deferred = $q.defer();

            $http.post(serviceBase + 'api/assessment', team)
                .success(function(response) {

                    deferred.resolve(response);

                }).error(function(err, status) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };

        var _deleteAssessment = function(team) {

            var deferred = $q.defer();

            $http.delete(serviceBase + 'api/assessment', team)
                .success(function(response) {

                    deferred.resolve(response);

                }).error(function(err, status) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };

        assessmentServiceFactory.getAssessment = _getAssessment;
        assessmentServiceFactory.createAssessment = _createAssessment;
        assessmentServiceFactory.updateAssessment = _updateAssessment;
        assessmentServiceFactory.deleteAssessment = _deleteAssessment;

        return assessmentServiceFactory;
    }
]);

export default app;