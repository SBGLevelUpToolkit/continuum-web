import angular from 'angular';

var app = angular.module('cn.onRenderComplete', [])
    .directive('onRenderComplete', /*@ngInject*/ function($timeout, mediatorService) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('NgRepeatRenderComplete');
                        //if (!!attr.onRenderComplete) {
                            mediatorService.notify('NgRepeatRenderComplete');
                            //$parse(attr.onRenderComplete)(scope);
                        //}
                    });
                }
            }
        };
    });

export default app;