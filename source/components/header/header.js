import template from './header.html!text';
import '../../services/security/authFactory';

var app = angular.module('cn.header', [ 'cn.auth', 'ui.router' ])
    .directive('cnHeader', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/ function(authService, assessmentService, $state) {
                this.signOut = function() {
                    authService.logOut();
                    $state.go('login');
                };

                this.checkAssessmentStatus = function() {
                    assessmentService.query((assessment) => {
                        if (assessment.Status === 'Closed') {
                            $state.go('home.assessment');
                        } else if (assessment.Status === 'Moderating') {
                            $state.go('home.moderateAssessment');
                        } else {
                            $state.go('home.assessment');
                        }
                    });
                };
            }
        };
    });

export default app;