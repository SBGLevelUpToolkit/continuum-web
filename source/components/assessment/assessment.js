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
                // How we get access to the child controller
                // Is there a better way?
                var childElem = element.find('cn-dimension'),
                    dimensionCtrl = childElem.isolateScope().ctrlDimension;
                controller.dimension = dimensionCtrl;

                //dimensionCtrl.dimensionRetrieved.promise.then(function() {
                //    controller.currentLevel = dimensionCtrl.minLevel;
                //});
            },
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, assessmentService, localStorageService, mediatorService) {
                //TODO Too much 'this'. Will fp help?
                //TODO Too much going on in this controller
                let levelNames = [ 'traveller', 'artisan', 'professional', 'expert', 'master' ];
                let user = localStorageService.get('userDetails');
                let gender = user.Teams[ 0 ].AvatarName === 'Barbarian' ? 'male' : 'female';

                mediatorService.listen('DimensionsAvailable', function(options) {
                    options.dimensionCtrl.selectDimension(options.dimensionCtrl.dimensions[ 0 ]);
                });

                let setRatingSelectedState = function(item) {
                    var idx = this.selectedCapabilities.indexOf(item.Id);
                    if (idx > -1) {
                        this.selectedCapabilities.splice(idx, 1);
                    } else {
                        this.selectedCapabilities.push(item.Id);
                    }
                };

                mediatorService.listen('DimensionChanged', (options) => {
                    this.currentLevel = options.minLevel;
                });

                this.userIsAdmin = localStorageService.get('userDetails').IsAdmin;
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
                                if (this.userIsAdmin) {
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
                    this.avatar = `menu_${levelNames[ this.currentLevel - 1 ]}_${gender}_avatar_icon.png`;
                };

                this.getNextLevel = function() {
                    this.dimension.getCapabilitiesAtLevel(++this.currentLevel);
                    this.avatar = `menu_${levelNames[ this.currentLevel - 1 ]}_${gender}_avatar_icon.png`;
                };
            }
        };
    });

export default app;