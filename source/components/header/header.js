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
            controller: /*@ngInject*/function(authService, assessmentService, $state, localStorageService, mediatorService) {
                let levelNames = [ 'traveller', 'artisan', 'professional', 'expert', 'master' ];

                mediatorService.listen('UserDetailsLoaded', () => {
                    let user = localStorageService.get('userDetails');
                    this.team = user.Teams[ 0 ].Name;
                    let gender = user.Teams[ 0 ].AvatarName === 'Barbarian' ? 'male' : 'female';
                    this.avatarType = `images/menu_${levelNames[ user.Teams[ 0 ].CurrentLevel ]}_${gender}_avatar_icon.png`;
                });

                this.signOut = function() {
                    authService.logOut();
                    $state.go('login');
                };

                this.checkAssessmentStatus = function(event) {
                    assessmentService.query((assessment) => {
                        if (assessment.Status === 'Closed') {
                            $state.go('home.assessment');
                        } else if (assessment.Status === 'Moderating') {
                            $state.go('home.moderateAssessment');
                        } else {
                            $state.go('home.assessment');
                        }
                    });

                    this.setActive(event);
                };

                this.setActive = function(event) {
                    $('.btn1').each(function(index, element) {
                        element.classList.remove('selected');
                    });
                    event.currentTarget.className += ' selected';
                };

            }
        };
    });

export default app;