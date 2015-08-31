import 'angular-mocks';
import './goals';
import '../../services/createFactories';

describe('Goals Directive', function() {

    var scope,
        elm,
        ctrl,
        compile,
        $httpBackend,
        passPromise;

    var goals = [
        {
            'Dimension': 'Strategy',
            'Capability': 'Be the best I can be',
            'Notes': 'Use fear and terror',
            'DueDate': '10 Aug 2015',
            'Completed': false
        },
        {
            'Dimension': 'Testing',
            'Capability': 'Be the worst I can be',
            'Notes': 'Use fear and loathing',
            'DueDate': '15 Aug 2015',
            'Completed': false
        },
        {
            'Dimension': 'Teamwork',
            'Capability': 'Be all I can be',
            'Notes': 'Use group hugs',
            'DueDate': '20 Aug 2015',
            'Completed': false
        },
        {
            'Dimension': 'Alignment',
            'Capability': 'Be someone else',
            'Notes': 'Improve impersonation skills',
            'DueDate': '25 Aug 2015',
            'Completed': false
        }
    ];

    beforeEach(function() {
        angular.mock.module('cn.goals');
        angular.mock.module('cn.goalFactory');
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('cn.capabilityFactory');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        compile = _$compile_;
        scope = _$rootScope_.$new();

    }));

    describe('When the directive compiles', function() {

        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));

        it('should get all goals', inject(function() {
            $httpBackend.expectGET('undefined/api/goal').respond(200, goals);
            elm = angular.element('<cn-goals></cn-goals>');
            compile(elm)(scope);
            scope.$digest();
            $httpBackend.flush();
            ctrl = elm.isolateScope().ctrl;
            expect(ctrl.goals.length).toEqual(4);
        }));

        it('should get all dimensions', inject(function() {

        }));

        it('should get all capabilities', inject(function() {

        }));
    });

    describe('When adding a new goal', function() {
        it('it should not call save if a capability has not been selected', inject(function() {

        }));

        it('it should not call save if a due date has not been selected', inject(function() {

        }));

        it('it should pass a valid goal object to be saved', inject(function() {

        }));

        it('should display the new goal when saving is successful', function() {
            passPromise = true;

            var user = {
                userName: 'br@ders.co.za',
                password: 'kensentme!'
            };

            ctrl.login(user);
            scope.$digest();
        });

        it('should display an error message when saving is unsuccessful', function() {
            passPromise = true;

            var user = {
                userName: 'br@ders.co.za',
                password: 'kensentme!'
            };

            ctrl.login(user);
            scope.$digest();
        });
    });
});