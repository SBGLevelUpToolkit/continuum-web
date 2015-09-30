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
            controller: /*@ngInject*/function controller($element, $state, assessmentService, moderateAssessmentHelper, mediatorService) {
                this.assessmentMessage = '';
                this.data = {
                    'DimensionResults': [
                        {
                            'DimensionId': 1,
                            'Rating': 0,
                            'ResponseCount': 7,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 1,
                                    'Level': 1,
                                    'ResponseCount': 1,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 3,
                                    'Level': 2,
                                    'ResponseCount': 3,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 3,
                                    'Level': 4,
                                    'ResponseCount': 3,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 2,
                            'Rating': 0,
                            'ResponseCount': 2,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 5,
                                    'Level': 1,
                                    'ResponseCount': 1,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 5,
                                    'Level': 2,
                                    'ResponseCount': 1,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 3,
                            'Rating': 0,
                            'ResponseCount': 2,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 1,
                                    'Level': 1,
                                    'ResponseCount': 1,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 2,
                                    'Level': 2,
                                    'ResponseCount': 1,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 4,
                            'Rating': 0,
                            'ResponseCount': 17,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 6,
                                    'Level': 1,
                                    'ResponseCount': 4,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 3,
                                    'Level': 2,
                                    'ResponseCount': 3,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 6,
                                    'Level': 3,
                                    'ResponseCount': 5,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 10,
                                    'Level': 5,
                                    'ResponseCount': 5,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 6,
                            'Rating': 0,
                            'ResponseCount': 3,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 3,
                                    'Level': 2,
                                    'ResponseCount': 3,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 1,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 7,
                            'Rating': 0,
                            'ResponseCount': 9,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 4,
                                    'Level': 3,
                                    'ResponseCount': 2,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 5,
                                    'Level': 4,
                                    'ResponseCount': 5,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 2,
                                    'Level': 5,
                                    'ResponseCount': 2,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 1,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 10,
                            'Rating': 0,
                            'ResponseCount': 6,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 4,
                                    'Level': 2,
                                    'ResponseCount': 1,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 8,
                                    'Level': 3,
                                    'ResponseCount': 3,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 5,
                                    'Level': 4,
                                    'ResponseCount': 2,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 1,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 12,
                            'Rating': 0,
                            'ResponseCount': 4,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 4,
                                    'Level': 1,
                                    'ResponseCount': 4,
                                    'LevelAchieved': true
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 2,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 5,
                            'Rating': 0,
                            'ResponseCount': 0,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 0,
                                    'Level': 1,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 2,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 8,
                            'Rating': 0,
                            'ResponseCount': 0,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 0,
                                    'Level': 1,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 2,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 9,
                            'Rating': 0,
                            'ResponseCount': 0,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 0,
                                    'Level': 1,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 2,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }, {
                            'DimensionId': 11,
                            'Rating': 0,
                            'ResponseCount': 0,
                            'Levels': [
                                {
                                    'TargetCapabilityCount': 0,
                                    'Level': 1,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 2,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 3,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, {
                                    'TargetCapabilityCount': 0,
                                    'Level': 4,
                                    'ResponseCount': 0,
                                    'LevelAchieved': false
                                }, { 'TargetCapabilityCount': 0, 'Level': 5, 'ResponseCount': 0, 'LevelAchieved': false }
                            ]
                        }
                    ], 'TotalUserCount': 1
                };

                assessmentService.score((assessment) => {
                    if (assessment.DimensionResults.length > 0) {
                        this.assessmentResult = assessment.DimensionResults.sort(function(a, b) {
                            return a.DimensionId < b.DimensionId ? -1 : 1;
                        }).map(function(dimension) {
                            return dimension.Levels.sort(function(a, b) {
                                return a.Level > b.Level ? -1 : 1;
                            });
                        });
                    } else {
                        this.assessmentMessage = 'No ratings were submitted';
                    }
                });

                this.data2 = [
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
                this.selectedCapabilities = [];

                this.loading = false;

                mediatorService.listen('NgRepeatRenderComplete', function() {
                    moderateAssessmentHelper.displayVisualisation($('div[rating]'), 'rating');
                });

                this.setModeratedRating = function(ev, item) {
                    let selectedElement = $(ev.currentTarget),
                        dimensionColumn = selectedElement.parent().find('div[rating]'),
                        selectedRating = selectedElement.find('div').text();

                    moderateAssessmentHelper.removeExistingModeratedRating(dimensionColumn);

                    $(ev.currentTarget).attr('moderated-rating', selectedRating);

                    moderateAssessmentHelper.displayVisualisation($(ev.currentTarget), 'moderated-rating');

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