var app = angular.module('cn.matchPassword', [])
    .directive('cnMatchPassword', function() {
        return {
            restrict: 'A',
            require: [ '^ngModel', '^form' ],
            link: function(scope, element, attrs, ctrls) {

                var formController = ctrls[ 1 ];
                var ngModel = ctrls[ 0 ];

                var otherPasswordModel = formController[ attrs.cnMatchPassword ];

                ngModel.$validators.passwordMatch = function(modelValue, viewValue) {
                    var password = modelValue || viewValue;
                    var otherPassword = otherPasswordModel.$modelValue || otherPasswordModel.viewValue;
                    return password === otherPassword;
                };

            }
        };
    });

export default app;