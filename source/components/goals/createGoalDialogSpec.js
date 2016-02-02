import 'angular-mocks';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import dialogController from './createGoalDialogController';
import '../../services/createFactories';
import dialogTemplate from './createGoalDialog.html!text';

fdescribe('Create Goals Dialog', function() {

    let scope,
        ctrl,
        elm,
        $filter,
        $mdDialog,
        $httpBackend,
        goalSpy,
        dimensionSpy,
        dimensionService = jasmine.createSpyObj('dimensionService', [ 'query', 'get' ]),
        goals = helper.getMock('goals'),
        dimensions = helper.getMock('dimensions').dimensions,
        capabilities = helper.getMock('dimension').dimension;

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        //angular.mock.module('cn.createGoalDialog');
        angular.mock.module('cn.goalFactory');
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module(function($provide) {
            $provide.value('dimensionService', dimensionService);
        });
    });

    var myApp = angular.module('myApp', []);

    myApp.directive('myDirective', {
        controller: 'MyDirectiveController',
        bindToController: {
            name: '@'
        }
    });

    myApp.controller('dialogController', dialogController);
    myApp.directive('goalDialog', function() {
        return {
            template: dialogTemplate
            //controllerAs: 'ctrlDialog',
            //bindToController: true,
            //controller: dialogController,
            //parent: angular.element(document.body),
            //locals: {
            //    selectedGoal: 'bar'
            //}
        };
    });

    beforeEach(function() {
        angular.mock.module('myApp');
    });

    beforeEach(inject(function(_$controller_, _$rootScope_, _$compile_, _goalService_, _dimensionService_) {
        //$httpBackend = _$httpBackend_;
        //$filter = _$filter_;
        //$mdDialog = _$mdDialog_;

        dimensionSpy = serviceSpy.dimension.bind(null, _dimensionService_);
        goalSpy = serviceSpy.goal.bind(null, _goalService_);

        dimensionSpy().query(dimensions);
        dimensionSpy().get(capabilities);

        //angular.mock.module('myApp');
        elm = angular.element('<div goal-dialog/>');
        scope = _$rootScope_;
        scope.ctrlDialog = _$controller_('dialogController', { foo: 'bar' });
        //scope.selectedGoal = goals[ 0 ];
        _$compile_(elm)(scope);
        scope.$digest();
        ctrl = elm.scope()[ 'ctrlDialog' ];

        //directive.scope = _$rootScope_.$new();
        //directive.scope.selectedGoal = 'foo';
        //
        ////directive.controller = dialogController;
        //directive.elm = angular.element('<body></body>');
        //_$compile_(directive.elm)(directive.scope);
        //directive.scope.$digest();
        //directive.ctrl = directive.elm.scope()[ 'ctrl' ];

        //ctrl = elm.isolateScope()[ ctrlName ];

        // TODO Create a mock directive using createGoalDialogController as the controller
        // Then figure out how to pass selectedGoal to the directive before the directive compiles

        // 2 reasons not to use the $mdDialog below:
        // 1. Seems to be async and only compiles after the assertion has run
        // 2. The call to show the dialog should probably be in the goal directive tests.

        //directive = helper.compileDirective('<body></body>', null, true);
        //
        //directive.ctrl =
        //{
        //    showCreateGoalDialog: function(ev, goal) {
        //        $mdDialog.show({
        //                controller: dialogController,
        //                controllerAs: 'ctrlDialog',
        //                bindToController: true,
        //                scope: directive.scope,
        //                template: dialogTemplate,
        //                parent: directive.elm,
        //                //targetEvent: ev,
        //                clickOutsideToClose: true,
        //                locals: {
        //                    selectedGoal: goal
        //                }
        //            })
        //            .then(() => {
        //                this.getGoals();
        //
        //            }, () => {
        //                //this.status = 'You cancelled the dialog.';
        //            });
        //    }
        //};
    }));

    describe('When the dialog opens', function() {
        it('it should get all dimensions', function() {
            //directive = helper.compileDirective('cn-create-goal-dialog', 'ctrlDialog');
            //directive.ctrl.showCreateGoalDialog();
            expect(ctrl.dimensions.length).toEqual(3);
        });
    });

    describe('When clearing a dimension', function() {
        it('should clear the capabilities array', function() {
            //directive = helper.compileDirective('cn-create-goal-dialog', 'ctrlDialog');
            directive.ctrl.capabilities = capabilities.Capabilities;
            expect(directive.ctrl.capabilities.length).toEqual(13);
            directive.ctrl.getCapabilitiesForSelectedDimension();
            expect(directive.ctrl.capabilities.length).toEqual(0);
        });
    });

    describe('When submitting a new goal', function() {
        //beforeEach(function() {
        //    directive = helper.compileDirective('cn-create-goal-dialog', 'ctrlDialog');
        //});

        it('it should call save if the form is valid', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            directive.scope.$apply(function() {
                directive.ctrl.selectedDimension = dimensions[ 0 ];
                directive.ctrl.goal = {
                    selectedCapability: capabilities.Capabilities[ 0 ],
                    DueDate: new Date('2015/10/10')
                };
            });
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).toHaveBeenCalled();
        });

        it('it should not call save if a dimension has not been selected', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            directive.scope.$apply(function() {
                directive.ctrl.goal = {
                    selectedCapability: capabilities.Capabilities[ 0 ],
                    DueDate: new Date('2015/10/10')
                };
            });
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should not call save if a capability has not been selected', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            directive.scope.$apply(function() {
                directive.ctrl.selectedDimension = dimensions[ 0 ];
                directive.ctrl.goal = {
                    DueDate: new Date('2015/10/10')
                };
            });
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should not call save if a due date has not been selected', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            directive.scope.$apply(function() {
                directive.ctrl.selectedDimension = dimensions[ 0 ];
                directive.ctrl.goal = {
                    selectedCapability: capabilities.Capabilities[ 0 ]
                };
            });
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should pass a valid goal object to be saved', function() {
            let teamSaveSpy = goalSpy().save();
            directive.ctrl.selectedDimension = dimensions[ 0 ];
            directive.ctrl.goal = {
                selectedCapability: capabilities.Capabilities[ 0 ],
                DueDate: new Date('2015/10/10')
            };

            directive.ctrl.saveGoal();
            expect(teamSaveSpy).toHaveBeenCalled();
        });

        //it('should display the new goal when saving is successful', function() {
        //});
        //
        //it('should display an error message when saving is unsuccessful', function() {
        //});
    });

    describe('When submitting an existing goal', function() {

        //beforeEach(function() {
        //    directive = helper.compileDirective('cn-create-goal-dialog', 'ctrlDialog');
        //    directive.ctrl.selectedGoal = goals[ 0 ];
        //});

        fit('it should call save if the form is valid', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            //directive.scope.$apply(function() {
            //    directive.ctrl.selectedDimension = dimensions[ 0 ];
            //    directive.ctrl.goal = {
            //        selectedCapability: capabilities.Capabilities[ 0 ],
            //        DueDate: new Date('2015/10/10')
            //    };
            //});
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).toHaveBeenCalled();
        });

        it('it should not call save if a dimension has not been selected', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            directive.scope.$apply(function() {
                directive.ctrl.goal = {
                    selectedCapability: capabilities.Capabilities[ 0 ],
                    DueDate: new Date('2015/10/10')
                };
            });
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should not call save if a capability has not been selected', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            directive.scope.$apply(function() {
                directive.ctrl.selectedDimension = dimensions[ 0 ];
                directive.ctrl.goal = {
                    DueDate: new Date('2015/10/10')
                };
            });
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should not call save if a due date has not been selected', function() {
            let mySpy = spyOn(directive.ctrl, 'saveGoal');

            directive.scope.$apply(function() {
                directive.ctrl.selectedDimension = dimensions[ 0 ];
                directive.ctrl.goal = {
                    selectedCapability: capabilities.Capabilities[ 0 ]
                };
            });
            var button = directive.elm.find('#saveGoal');
            button.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should pass a valid goal object to be updated', function() {
            let teamUpdateSpy = goalSpy().update();
            directive.ctrl.selectedDimension = dimensions[ 0 ];
            directive.ctrl.goal = {
                selectedCapability: capabilities.Capabilities[ 0 ],
                DueDate: new Date('2015/10/10')
            };

            directive.ctrl.saveGoal();
            expect(teamUpdateSpy).toHaveBeenCalled();
        });

        it('should display the new goal when saving is successful', function() {
        });

        it('should display an error message when saving is unsuccessful', function() {
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});