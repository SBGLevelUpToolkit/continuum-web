import template from './moderateAssessment.html!text';
import 'angular-resource';
import 'angular-ui-router';
import '../../services/dimension';
import 'lodash';
import 'd3';

function displayVisualisation(element, ratingType) {
    element.each(function(index, elm) {
        let element = $(elm).find('div:first-child')[ 0 ],
            rating = $(elm).attr(ratingType),
            fill = ratingType === 'moderated-rating' ? 'rgba(3, 128, 26, 1)' : 'rgba(255,255,255,0.5';

        if (rating > 0) {
            $(element).text('');

            var svg = d3.select(element).append('svg')
                .attr('width', 50)
                .attr('height', 50);

            /* Define the data for the circles */
            var elem = svg.selectAll('g myCircleText')
                .data(rating);

            /*Create and place the 'blocks' containing the circle and the text */
            var elemEnter = elem.enter()
                .append('g')
                .attr('transform', function(d) {
                    return 'translate(25, 25)';
                });

            /*Create the circle for each block */
            var circle = elemEnter.append('circle')
                .attr('r', 0)
                .attr('stroke', 'black')
                .attr('fill', fill);

            /* Create the text for each block */
            elemEnter.append('text')
                .attr('dx', function(d) {
                    return -5;
                })
                .attr('dy', function(d) {
                    return 5;
                })
                .text(function(d) {
                    return d;
                });

            circle
                .transition()
                .delay(250)
                .attr('r', function(d) {
                    return ratingType === 'moderated-rating' ? 25 :  d * 5;
                });

        }
    });
}

var app = angular.module('cn.moderateAssessment', [ 'ngResource', 'ui.router', 'dimension' ])
    .directive('cnModerateAssessment', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, assessmentService, dimension) {

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

                        displayVisualisation($('div[rating]'), 'rating');
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

                function removeExistingModeratedRating(dimensionColumn) {
                    dimensionColumn.each(function(element) {
                        $(element).attr('moderatedRating', '');
                    });
                }

                this.setModeratedRating = function(ev, item) {
                    let selectedElement = $(ev.currentTarget),
                        dimensionColumn = selectedElement.parent().find('div[rating]'),
                        selectedRating = selectedElement.find('div').text();

                    removeExistingModeratedRating(dimensionColumn);

                    $(ev.currentTarget).attr('moderated-rating', selectedRating);

                    displayVisualisation($(ev.currentTarget), 'moderated-rating');

                    let ratingInfo = [
                        {
                            CapabilityId: item.Id,
                            CapabilityAchieved: this.capabilityIsSelected(item)
                        }
                    ];

                    //assessmentService.update(ratingInfo, function(response) {
                    //        console.log('SUCCESS: ');
                    //    },
                    //    function(response) {
                    //        console.log('ERROR: ');
                    //    });
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