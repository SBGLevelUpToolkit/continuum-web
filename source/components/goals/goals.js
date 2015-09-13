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
                    this.getGoals = () => {
                        this.goals = goalService.query();
                    };

                    this.getGoals();

                    this.updateGoalStatus = (Id) => {
                        console.log('Foo : ' + Id);
                    //    goalService.update({ item }, (response) => {
                    //            this.loading = false;
                    //            $state.go('home');
                    //        },
                    //        (response) => {
                    //            this.loading = false;
                    //            this.formInvalid = true;
                    //        }
                    //)
                    };

                    this.showCreateGoalDialog = (ev, goal) => {
console.log('GOAL: ' + goal);
                        $mdDialog.show({
                            controller: dialogController,
                            controllerAs: 'ctrlDialog',
                            bindToController: true,
                            template: templateCreate,
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            locals : {
                                selectedGoal : goal
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