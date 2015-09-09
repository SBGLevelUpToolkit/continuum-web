import template from './goals.html!text';
import templateCreate from './createGoalDialog.html!text';
import 'angular-ui-router';

var app = angular.module('cn.goals', [ 'ui.router', 'cn.goalFactory', 'cn.dimensionFactory' ])
        .directive('cnGoals', function() {
            return {
                scope: {},
                restrict: 'E',
                template: template,
                controllerAs: 'ctrl',
                bindToController: true,
                controller: /*@ngInject*/function controller($state, goalService, $mdDialog) {
                    this.getGoals = () => {
                        this.goals = goalService.query();
                    };

                    this.getGoals();

                    this.showCreateGoalDialog = (ev) => {
                        $mdDialog.show({
                            controller: dialogController,
                            controllerAs: 'ctrlDialog',
                            bindToController: true,
                            template: templateCreate,
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true
                        })
                            .then(() => {
                                this.getGoals();

                            }, () => {
                                //this.status = 'You cancelled the dialog.';
                            });
                    };

                    function dialogController($filter, $mdDialog, goalService, dimensionService) {

                        this.cancel = () => {
                            $mdDialog.cancel();
                        };

                        // TODO Add caching to the dimension class and refactor it to exclude style function
                        dimensionService.query((dimensions) => {
                            this.dimensions = _.sortBy(dimensions, function(dimension) {
                                return dimension.DisplayOrder;
                            });
                        });

                        this.getCapabilitiesForSelectedDimension = function(dimensionId) {
                            if (dimensionId) {
                                dimensionService.get({ dimension: dimensionId },
                                    (dimension) => {
                                        this.capabilities = dimension.Capabilities;
                                    });
                            } else {
                                this.capabilities = [];
                            }
                        };

                        this.addGoal = function() {
                            var lastWeek = $filter('date')(this.goal.DueDate, 'yyyy-MM-ddTHH.mm.ss.sssZ');
                            let goal = {
                                CapabilityId: this.goal.selectedCapability.Id,
                                Notes: this.goal.Notes,
                                DueDate: this.goal.DueDate
                            };

                            goalService.save(goal);
                            $mdDialog.hide();
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
                                return (items[ propertyName ].toLowerCase().indexOf(lowercaseQuery) === 0);
                            };
                        };
                    }
                }
            };
        })
    ;

export default app;