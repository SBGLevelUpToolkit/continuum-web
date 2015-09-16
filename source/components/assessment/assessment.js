import template from './assessment.html!text';
import 'angular-resource';
import 'angular-ui-router';
import './dimension';
import 'lodash';

var app = angular.module('cn.assessment', [ 'ngResource', 'ui.router', 'dimension' ])
    .directive('cnAssessment', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller(assessmentService, dimension) {
                this.loading = true;
                this.dimension = dimension;
                this.activeDimension = {};
                this.selectedCapabilities = [];

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

                this.setStatusToModerated = function() {

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