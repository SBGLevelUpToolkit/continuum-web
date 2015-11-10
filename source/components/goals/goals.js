import moment from 'moment';
import dialogController from './createGoalDialog';
import template from './goals.html!text';
import templateCreate from './createGoalDialog.html!text';

var app = angular.module('cn.goals', [ 'ui.router', 'cn.goalFactory', 'cn.dimensionFactory' ])
    .directive('cnGoals', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, $filter, dimensionService, goalService, $mdDialog) {
                this.loading = true;
                this.showCompletedGoals = true;

                this.getGoals = function() {
                    goalService.query((goals) => {
                        this.goals = goals;
                        this.toggleGoalStatusVisibility();
                        this.loading = false;
                    });
                };

                this.toggleGoalStatusVisibility = function() {
                    this.showCompletedGoals = !this.showCompletedGoals;
                    this.goalsToDisplay = this.showCompletedGoals ? this.goals : this.goals.filter((goal) => {
                        return !goal.Completed;
                    });
                };

                this.getGoals();

                this.updateGoalStatus = (goal) => {
                    goal.Completed = !goal.Completed;
                    goalService.update(goal, (response) => {
                            //let foo = this.goals.filter((item) => {
                            //    return item.Id = goal.Id;
                            //}).
                            //foo.Completed = goal.Completed;
                        },
                        (response) => {
                            this.loading = false;
                            this.formInvalid = true;
                        }
                    );
                };

                this.deleteGoal = function(goal) {
                    goalService.delete(goal, () => {
                        var idx = this.goals.findIndex(function(item) {
                            if (item.Id === goal.Id) {
                                return true;
                            }
                        });
                        this.goals.splice(idx, 1);
                    });
                };

                this.showCreateGoalDialog = function(ev, goal) {
                    $mdDialog.show({
                            controller: dialogController,
                            controllerAs: 'ctrlDialog',
                            bindToController: true,
                            template: templateCreate,
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            locals: {
                                selectedGoal: goal
                            }
                        })
                        .then(() => {
                            this.getGoals();

                        }, () => {
                            //this.status = 'You cancelled the dialog.';
                        });
                };

            }
        };
    })
    ;

export default app;