import template from './moderateAssessment.html!text';
import './moderateAssessmentHelper';
import 'angular-resource';
import 'angular-ui-router';
import '../../services/dimension';
import 'lodash';
import 'd3';

var app = angular.module('cn.moderateAssessment', [ 'ngResource', 'ui.router', 'cn.dimension', 'cn.moderateAssessmentHelper' ])
    .directive('cnModerateAssessment', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, assessmentService, dimension, helper) {

                this.data = [
                    {
                        'AssessmentId': 1,
                        'DimensionId': 1,
                        'Rating': 3
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 2,
                        'Rating': 3
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 3,
                        'Rating': 1
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 4,
                        'Rating': 5
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 5,
                        'Rating': 4
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 6,
                        'Rating': 2
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 7,
                        'Rating': 3
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 8,
                        'Rating': 3
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 9,
                        'Rating': 1
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 10,
                        'Rating': 5
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 11,
                        'Rating': 4
                    },
                    {
                        'AssessmentId': 1,
                        'DimensionId': 12,
                        'Rating': 2
                    }
                ];

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

                        helper.displayVisualisation($('div[rating]'), 'rating');
                    });
                });

                this.selectDimension = function(selDimension) {
                    this.activeDimension.class = 'dimension-blur';
                    this.activeDimension = selDimension;
                    this.activeDimension.class = 'dimension-focus';
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

                this.setModeratedRating = function(ev, item) {
                    let selectedElement = $(ev.currentTarget),
                        dimensionColumn = selectedElement.parent().find('div[rating]'),
                        selectedRating = selectedElement.find('div').text();

                    helper.removeExistingModeratedRating(dimensionColumn);

                    $(ev.currentTarget).attr('moderated-rating', selectedRating);

                    helper.displayVisualisation($(ev.currentTarget), 'moderated-rating');

                    let ratingInfo = [
                        {
                            CapabilityId: item.Id,
                            CapabilityAchieved: this.capabilityIsSelected(item)
                        }
                    ];

                    assessmentService.update(ratingInfo, function(response) {
                            console.log('SUCCESS: ');
                        },
                        function(response) {
                            console.log('ERROR: ');
                        });
                };

                this.setStatus = function(action) {
                    if (action === 'reopen') {
                        assessmentService.reopen();
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