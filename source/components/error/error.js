import template from './error.html!text';

var app = angular.module('cn.error', [])
    .directive('cnError', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs, ctrl) {

                //TODO So this is one way of communicating with another controller
                // I could also use the mediator
                // but is there a better way to simply set the loading property on the parent directive
                // without having to add any code to the parent controller.
                // This must work by convention and the only requirement in the parent is a loading property
                scope.ctrlError.parent = scope.ctrl;
            },
            template: template,
            controllerAs: 'ctrlError',
            bindToController: true,
            controller: /*@ngInject*/function controller(mediatorService) {
                this.loading = false;
                this.formInvalid = false;

                mediatorService.listen('ServiceError', (errorDetails) => {
                    this.message = errorDetails.errorDescription ? errorDetails.errorDescription : 'An error occurred';
                    this.formInvalid = true;
                    this.parent.loading = false;
                });
            }
        };
    });

export default app;