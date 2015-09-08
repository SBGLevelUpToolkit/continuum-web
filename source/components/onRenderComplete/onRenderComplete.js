import angular from 'angular';

var app = angular.module('onRenderComplete', [])
    .directive('onRenderComplete', /*@ngInject*/ function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    });

export default app;