import template from './assessment.html!text';
import 'angular-resource';
import 'angular-ui-router';
import 'angular-ui';

var app = angular.module('cn.assessment', [ 'ngResource', 'ui.router', 'ui.bootstrap' ])
    .directive('cnAssessment', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($resource, $scope, $http, $state, dimensionService) {
                this.dimensions = dimensionService.query();
                //dimensionService.get({ dimension: 1 });
                this.changeTab = (tab) => {
                    this.view_tab = tab;
                }
            }
        };
    });

export default app;