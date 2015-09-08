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
                this.dimension = dimension;

                dimension.getAllDimensions();

                assessmentService.query((assessment) => {
                        this.selectedCapabilities = assessment.AssessmentItems.map((item) => {
                            if (item.CapabilityAchieved) {
                                return item.CapabilityId;
                            }
                        });
                    },
                    (response) => {
                        console.log(response);
                    });

                this.saveRating = function(item) {
                    setRatingSelectedState.call(this, item);

                    let ratingInfo = [
                        {
                            CapabilityId: item.Id,
                            CapabilityAchieved: this.capabilityIsSelected(item)
                        }
                    ];

                    assessmentService.save(ratingInfo, function(response) {
                            //console.log('SUCCESS: ' + response);
                        },
                        function(response) {
                            //console.log('ERROR: ' + response);
                        });
                };

                this.capabilityIsSelected = function(item) {
                    return (this.selectedCapabilities) ? this.selectedCapabilities.indexOf(item.Id) > -1 : false;
                };

                function setRatingSelectedState(item) {
                    if (this.selectedCapabilities) {
                        var idx = this.selectedCapabilities.indexOf(item.Id);
                        if (idx > -1) {
                            this.selectedCapabilities.splice(idx, 1);
                        } else {
                            this.selectedCapabilities.push(item.Id);
                        }
                    }
                }

            }
        };
    });

export default app;