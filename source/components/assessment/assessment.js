import template from './assessment.html!text';
import 'angular-resource';
import 'angular-ui-router';
import '../../services/dimension';
import 'lodash';
import 'angular-local-storage';

var app = angular.module('cn.assessment', [ 'ngResource', 'ui.router', 'cn.dimension' ])
    .directive('cnAssessment', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, assessmentService, dimension, localStorageService) {
                let setRatingSelectedState = function(item) {
                    var idx = this.selectedCapabilities.indexOf(item.Id);
                    if (idx > -1) {
                        this.selectedCapabilities.splice(idx, 1);
                    } else {
                        this.selectedCapabilities.push(item.Id);
                    }
                };

                this.userIsAdmin = localStorageService.get('userDetails').IsAdmin;
                this.loading = true;
                this.activeAssessment = true;
                this.dimension = dimension;
                this.activeDimension = {};
                this.selectedCapabilities = [];

                this.setStatus = function() {
                    if (this.assessmentAction === 'Create') {
                        assessmentService.create();
                    } else {
                        assessmentService.moderate();
                        $state.go('home.moderateAssessment');
                    }
                };

                assessmentService.query((assessment) => {
                        if (assessment.Status) {
                            if (assessment.Status === 'closed') {
                                this.activeAssessment = false;
                                this.assessmentAction = 'Create';
                            } else {
                                this.assessmentAction = 'Moderate';
                                this.selectedCapabilities = assessment.AssessmentItems.filter((item) => {
                                    return item.CapabilityAchieved;
                                }).map(item => {
                                    return item.CapabilityId;
                                });

                                this.loading = false;

                                let dimensionsRetrieved = dimension.getAllDimensions();
                                dimensionsRetrieved.then((dimensions) => {
                                    this.selectDimension(dimensions[ 0 ]);
                                });

                                this.selectDimension = function(selDimension) {
                                    this.activeDimension.class = 'dimension-blur';
                                    this.activeDimension = selDimension;
                                    selDimension.class = 'pulse';

                                    let dimensionRetrieved = dimension.getDimension(selDimension.Id);
                                    dimensionRetrieved.then((data) => {
                                        this.activeDimension.class = 'dimension-focus';
                                    });
                                };

                                this.hasFocus = function(selDimension) {
                                    if (selDimension !== this.activeDimension) {
                                        selDimension.class = 'dimension-focus';
                                    }
                                };

                                this.lostFocus = function(selDimension) {
                                    if (selDimension !== this.activeDimension) {
                                        selDimension.class = 'dimension-blur';
                                    }
                                };

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
                            }
                        } else {
                            this.loading = false;
                            this.assessmentAction = 'Create';
                            this.activeAssessment = false;
                        }
                    },
                    (response) => {
                        this.loading = false;
                        this.assessmentAction = 'Create';
                        this.activeAssessment = false;
                        this.assessmentMessage = response.data;
                    });
            }
        };
    });

export default app;