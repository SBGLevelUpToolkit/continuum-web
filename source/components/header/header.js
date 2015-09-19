import template from './header.html!text';
import '../../services/security/authFactory';
import 'angular-local-storage';

var app = angular.module('cn.header', [ 'cn.auth', 'ui.router' ])
    .directive('cnHeader', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/ function(authService, assessmentService, $state, localStorageService) {
                const avatars = {
                    Barbarian: 'images/menu_traveller_male_avatar_icon.png',
                    Amazon: 'images/menu_traveller_female_avatar_icon.png'
                };

                let user = localStorageService.get('userDetails');
                this.team = user.Teams[ 0 ].Name;
                this.avatarType = avatars[ user.Teams[ 0 ].AvatarName ];

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