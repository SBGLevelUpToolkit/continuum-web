import template from './goals.html!text';
import 'angular-ui-router';

var app = angular.module('cn.goals', [ 'ui.router', 'cn.goalFactory', 'cn.dimensionFactory' ])
    .directive('cnGoals', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, goalService, dimensionService) {
                this.goals = goalService.query();

                this.dimensions = dimensionService.query((dimensions) => {
                    this.dimensions = _.sortBy(dimensions, function(dimension) {
                        return dimension.DisplayOrder;
                    });
                });

                this.getCapabilitiesForSelectedDimension = function(dimensionId) {
                    this.fullDimension = dimensionService.get({ dimension: dimensionId },
                        (dimension) => {
                            //this.getCapabilitiesAtLevel(1);
                        });
                };

                this.selectedItemChange = function(item) {
                    this.getCapabilitiesForSelectedDimension(item.Id);
                };

                this.searchTextChange = (text, selectedItem) => {
                    selectedItem = text;
                };

                this.querySearch = (query, items, propertyName) => {
                    return query ? items.filter(this.createFilterFor(query, items, propertyName)) : items;
                };

                this.createFilterFor = function(query, items, propertyName = 'Name') {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(items) {
                        return (items[propertyName].toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                };
            }
        };
    });

export default app;