import template from './assessment.html!text';
import 'angular-resource';
import 'angular-ui-router';

var app = angular.module('cn.assessment', [ 'ngResource', 'ui.router' ])
    .directive('cnAssessment', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($resource, $scope, $http, $state, dimensionService) {
                this.dimensions = dimensionService.query();
                this.fullDimension = dimensionService.get({ dimension: 1 });
            }
        };
    });

export default app;