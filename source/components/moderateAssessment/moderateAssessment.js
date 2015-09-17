import template from './moderateAssessment.html!text';
import 'angular-resource';
import 'angular-ui-router';
import '../../services/dimension';
import 'lodash';

var app = angular.module('cn.moderateAssessment', [ 'ngResource', 'ui.router', 'dimension' ])
    .directive('cnModerateAssessment', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, assessmentService, dimension) {
                this.loading = true;
                this.dimension = dimension;
                this.activeDimension = {};
                this.selectedCapabilities = [];

                let dimensionsRetrieved = dimension.getAllDimensions();
                dimensionsRetrieved.then((dimensions) => {
                    assessmentService.query((assessments) => {
                        this.assessment = dimensions.map(function(dimension) {
                            let assessment = assessments.AssessmentResults.filter(function(assessment) {
                                return assessment.DimensionId === dimension.Id;
                            });

                            return {
                                Id: dimension.Id,
                                Name: dimension.Name,
                                DisplayOrder: dimension.DisplayOrder,
                                ImageName: dimension.ImageName,
                                Rating: assessment.Rating
                            };
                        });

                        this.loading = false;
                        console.log(this.assessment);
                    });
                });

                this.selectDimension = function(selDimension) {
                    this.activeDimension.class = 'dimension-blur';
                    this.activeDimension = selDimension;
                    selDimension.class = 'pulse';

                    let dimensionRetrieved = dimension.getDimension(selDimension.Id);
                    dimensionRetrieved.then((data) => {
                        this.loading = false;
                        this.activeDimension.class = 'dimension-focus';
                    });
                };

                assessmentService.query((assessment) => {
                        this.selectedCapabilities = assessment.AssessmentItems.filter((item) => {
                            return item.CapabilityAchieved;
                        }).map(item => {
                            return item.CapabilityId;
                        });
                    },
                    (response) => {
                        console.log(response);
                    });

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

                this.setStatus = function(action) {
                    if (this.assessmentAction === 'open') {
                        assessmentService.open();
                    } else {
                        assessmentService.close();
                        $state.go('home.moderateAssessment');
                    }
                };

                this.capabilityIsSelected = function(item) {
                    return this.selectedCapabilities.indexOf(item.Id) > -1;
                };

                function setRatingSelectedState(item) {
                    var idx = this.selectedCapabilities.indexOf(item.Id);
                    if (idx > -1) {
                        this.selectedCapabilities.splice(idx, 1);
                    } else {
                        this.selectedCapabilities.push(item.Id);
                    }
                }
            }
        };
    });

export default app;