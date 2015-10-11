import template from './assessment.html!text';
import 'angular-resource';
import 'angular-ui-router';
import 'lodash';
import 'angular-local-storage';

var app = angular.module('cn.assessment', [ 'ngResource', 'ui.router', 'LocalStorageModule' ])
    .directive('cnAssessment', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template,
            link: function link(scope, element, attrs, controller) {
                var childElem = element.find('cn-dimension'),
                    dimensionCtrl = childElem.isolateScope().ctrlDimension;
                controller.dimension = dimensionCtrl;
            },
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, assessmentService, localStorageService, mediatorService) {
                let levelNames,
                    gender;

                this.user = localStorageService.get('userDetails');

                let setAvatar = () => {
                    if (this.user && this.currentLevel) {
                        levelNames = [ 'traveller', 'artisan', 'professional', 'expert', 'master' ];
                        gender = this.user.Teams[ 0 ].AvatarName === 'Barbarian' ? 'male' : 'female';
                        this.avatar = `menu_${levelNames[ this.currentLevel - 1 ]}_${gender}_avatar_icon.png`;
                    }
                };

                mediatorService.listen('UserDetailsLoaded', () => {
                    this.user = localStorageService.get('userDetails');
                    setAvatar();
                });

                mediatorService.listen('DimensionsAvailable', function(dimensionCtrl) {
                    dimensionCtrl.selectDimension(dimensionCtrl.dimensions[ 0 ]);
                });

                mediatorService.listen('DimensionChanged', (minLevel) => {
                    this.currentLevel = minLevel;
                    setAvatar();
                });

                let setRatingSelectedState = function(item) {
                    var idx = this.selectedCapabilities.indexOf(item.Id);
                    if (idx > -1) {
                        this.selectedCapabilities.splice(idx, 1);
                    } else {
                        this.selectedCapabilities.push(item.Id);
                    }
                };

                this.loading = true;
                this.activeAssessment = true;
                this.selectedCapabilities = [];

                this.setStatus = function() {
                    if (this.assessmentAction === 'Create') {
                        assessmentService.create(() => {
                            getAssessment.call(this);
                        });
                    } else {
                        assessmentService.moderate(() => {
                            $state.go('home.moderateAssessment');
                        });
                    }
                };

                function getAssessment() {
                    assessmentService.query((assessment) => {
                            if (!assessment.Status || assessment.Status === 'Closed') {
                                this.loading = false;
                                this.activeAssessment = false;
                                this.assessmentAction = 'Create';
                                if (this.user.IsAdmin) {
                                    this.assessmentMessage = 'There is no active assessment. Click Create to create an assessment.';
                                } else {
                                    this.assessmentMessage = 'There is no active assessment.';
                                }
                            } else {
                                this.activeAssessment = true;
                                this.assessmentAction = 'Moderate';
                                this.selectedCapabilities = assessment.AssessmentItems.filter((item) => {
                                    return item.CapabilityAchieved;
                                }).map(item => {
                                    return item.CapabilityId;
                                });

                                this.loading = false;
                            }
                        },
                        (response) => {
                            this.loading = false;
                            this.assessmentAction = 'Create';
                            this.activeAssessment = false;
                            this.assessmentMessage = response.data;
                        });
                }

                getAssessment.call(this);

                this.saveRating = function(item) {
                    setRatingSelectedState.call(this, item);

                    let ratingInfo = [
                        {
                            CapabilityId: item.Id,
                            CapabilityAchieved: this.capabilityIsSelected(item)
                        }
                    ];

                    assessmentService.save(ratingInfo, function(response) {
                            console.log('SUCCESS: ');
                        },
                        function(response) {
                            console.log('ERROR: ');
                        });
                };

                this.capabilityIsSelected = function(item) {
                    return this.selectedCapabilities.indexOf(item.Id) > -1;
                };

                this.getPreviousLevel = function() {
                    this.dimension.getCapabilitiesAtLevel(--this.currentLevel);
                    setAvatar();
                };

                this.getNextLevel = function() {
                    this.dimension.getCapabilitiesAtLevel(++this.currentLevel);
                    setAvatar();
                };
            }
        };
    });

export default app;