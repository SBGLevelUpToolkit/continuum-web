import template from './dimension.html!text';
import 'angular-resource';
import 'lodash';

var app = angular.module('cn.dimension', [ 'ngResource', 'ui.router' ])
    .directive('cnDimension', function() {

        var link = function(scope, element, attributes, ctrl) {
            if (attributes.disableService) {
                ctrl.serviceDisabled = true;
            }
        };

        return {
            scope: {},
            restrict: 'E',
            template: template,
            link: link,
            controllerAs: 'ctrlDimension',
            bindToController: true,
            controller: /*@ngInject*/function controller($q, dimensionService, mediatorService) {
                this.serviceDisabled = false;
                this.dimensionRetrieved = $q.defer(); // Notify any subscribers when dimensions have been retrieved

                let activeDimension = {};

                let getDimensionData = (dimensionId) => {
                    return dimensionService.get({ dimension: dimensionId },
                        (dimension) => {
                            this.fullDimension = dimension;
                            this.minLevel = _.min(_.pluck(dimension.Capabilities, 'Level'));
                            this.maxLevel = _.max(_.pluck(dimension.Capabilities, 'Level'));
                            this.getCapabilitiesAtLevel(this.minLevel);
                            mediatorService.notify('DimensionChanged', this.minLevel, dimensionId );
                            this.dimensionRetrieved.resolve();
                        }).$promise;
                };

                this.selectDimension = function(selDimension) {
                    activeDimension.class = 'dimension-blur';
                    activeDimension = selDimension;
                    selDimension.class = 'pulse';

                    if (!this.serviceDisabled) {
                        let dimensionRetrieved = getDimensionData(selDimension.Id);
                        dimensionRetrieved.then(() => {
                            activeDimension.class = 'dimension-focus';
                        });
                    } else {
                        activeDimension.class = 'dimension-focus';
                        mediatorService.notify('DimensionChanged', this.minLevel, selDimension.Id );
                    }
                };

                this.getCapabilitiesAtLevel = function(currentLevel) {
                    this.capabilitiesAtSelectedLevel = _.filter(this.fullDimension.Capabilities, function(capability) {
                        return capability.Level === currentLevel;
                    });
                };

                this.hasFocus = function(selDimension) {
                    if (selDimension !== activeDimension) {
                        selDimension.class = 'dimension-focus';
                    }
                };

                this.lostFocus = function(selDimension) {
                    if (selDimension !== activeDimension) {
                        selDimension.class = 'dimension-blur';
                    }
                };

                let getAllDimensions = () => {
                    dimensionService.query((dimensions) => {
                        this.dimensions = _.sortBy(dimensions, (dimension) => {
                            return dimension.DisplayOrder;
                        });
                        mediatorService.notify('DimensionsAvailable', this );
                        //this.selectDimension(dimensions[ 0 ]);
                    });
                };

                getAllDimensions();
            }
        };
    });

export default app;