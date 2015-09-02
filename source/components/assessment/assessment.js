import template from './assessment.html!text';
import 'angular-resource';
import 'angular-ui-router';
import 'lodash';

var app = angular.module('cn.assessment', [ 'ngResource', 'ui.router' ])
    .directive('cnAssessment', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($resource, $scope, $http, $state, dimensionService, assessmentService) {
                let self = this;
                this.currentLevel = 1;
                this.selectedCapabilities = [];
                this.capabilitiesAtSelectedLevel = [];

                this.dimensions = dimensionService.query((dimensions) => {
                    _.sortBy(dimensions, function(dimension) {
                        return dimension.DisplayOrder;
                    });

                    this.fullDimension = dimensionService.get({ dimension: dimensions[ 0 ].Id },
                        (dimension) => {
                            this.minLevel = _.min(_.pluck(dimension.Capabilities, 'Level'));
                            this.maxLevel = _.max(_.pluck(dimension.Capabilities, 'Level'));
                            getCapabilitiesAtLevel();
                        });
                });

                this.getPreviousLevel = function() {
                    getCapabilitiesAtLevel(--this.currentLevel);
                };

                this.getNextLevel = function() {
                    getCapabilitiesAtLevel(++this.currentLevel);
                };

                this.saveRating = function(item) {
                    var idx = this.selectedCapabilities.indexOf(item);
                    if (idx > -1) {
                        this.selectedCapabilities.splice(idx, 1);
                    } else {
                        this.selectedCapabilities.push(item);
                    }

                    let ratingInfo = {
                        AssessmentId: 1,
                        CapabilityId: item.Id,
                        CapabilityAchieved: capabilityIsSelected(item)
                    };

                    assessmentService.save(ratingInfo, function(response) {
                            console.log('SUCCESS: ' + response);
                        },
                        function(response) {
                            console.log('ERROR: ' + response);
                        });
                };

                function getCapabilitiesAtLevel() {
                    self.capabilitiesAtSelectedLevel = _.filter(self.fullDimension.Capabilities, function(capability) {
                        return capability.Level === self.currentLevel;
                    });
                }

                function capabilityIsSelected(item) {
                    return self.selectedCapabilities.indexOf(item) > -1;
                }
            }
        };
    });

export default app;