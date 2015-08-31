import template from './goals.html!text';
import 'angular-ui-router';

var app = angular.module('cn.goals', [ 'ui.router', 'cn.goalFactory' ])
    .directive('cnGoals', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, goalService) {
                this.goals = goalService.query();
            }
        };
    });

export default app;