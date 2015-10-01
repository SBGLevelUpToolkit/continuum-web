import template from './moderateAssessment.html!text';
import './moderateAssessmentHelper';
import 'angular-resource';
import 'angular-ui-router';
import 'lodash';
import 'd3';

var app = angular.module('cn.moderateAssessment', [ 'ngResource', 'ui.router', 'cn.moderateAssessmentHelper' ])
    .directive('cnModerateAssessment', function() {

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
            },
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($element, $state, assessmentService, moderateAssessmentHelper,
                                                         mediatorService) {
                this.loading = true;
                let assessmentId;
                this.assessmentMessage = '';

                assessmentService.query((assessment) => {
                    assessmentId = assessment.Id;

                    assessmentService.score((score) => {
                        if (score.DimensionResults.length > 0) {
                            this.assessmentResult = score.DimensionResults.sort(function(a, b) {
                                return a.DimensionId < b.DimensionId ? -1 : 1;
                            }).map(function(dimension) {
                                let levels = dimension.Levels.sort(function(a, b) {
                                    return a.Level > b.Level ? -1 : 1;
                                });

                                let result = assessment.AssessmentResults.filter((item) => {
                                    return item.DimensionId === dimension.DimensionId;
                                });

                                return {
                                    dimensionId: dimension.DimensionId,
                                    rating: result[ 0 ] ? result[ 0 ].Rating : 0,
                                    levels: levels
                                };
                            });
                            this.loading = false;
                        } else {
                            this.loading = false;
                            this.assessmentMessage = 'No ratings were submitted';
                        }
                    });
                });

                mediatorService.listen('NgRepeatRenderComplete', function() {
                    moderateAssessmentHelper.displayVisualisation($('div[rating]'), 'rating');
                    showModeratedRatings();
                });

                mediatorService.listen('DimensionChanged', function(dimension) {
                    highlightDimensionColumn(dimension.dimensionId);
                });

                function highlightDimensionColumn(dimensionId) {
                    $('#scoreBlock > [ng-repeat]').each(function(index, elm) {
                        $(elm).removeClass('column-focus');
                    });

                    let selectedColumn = $($('#scoreBlock > [ng-repeat]')[ dimensionId - 1 ]);
                    selectedColumn.addClass('column-focus');
                }

                function showModeratedRatings() {
                    $('div[moderated-rating]').each(function(index, elm) {
                        if (+$(elm).attr('moderated-rating') > 0) {
                            moderateAssessmentHelper.displayVisualisation($(elm), 'moderated-rating');
                        }
                    });
                }

                this.setModeratedRating = function(ev, item) {
                    let selectedElement = $(ev.currentTarget),
                        dimensionColumn = selectedElement.parent().find('div[rating]'),
                        selectedRating = selectedElement.find('div').text();

                    moderateAssessmentHelper.removeExistingModeratedRating(dimensionColumn);

                    $(ev.currentTarget).attr('moderated-rating', selectedRating);

                    moderateAssessmentHelper.displayVisualisation($(ev.currentTarget), 'moderated-rating');

                    let ratingInfo = [
                        {
                            AssessmentId: assessmentId,
                            DimensionId: item.dimensionId,
                            Rating: selectedRating
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
                        assessmentService.reopen(() => {
                            $state.go('home.assessment');
                        });
                    } else {
                        assessmentService.close();
                    }
                };

                this.capabilityIsSelected = function(item) {
                    return this.selectedCapabilities.indexOf(item.Id) > -1;
                };
            }
        };
    });

export default app;