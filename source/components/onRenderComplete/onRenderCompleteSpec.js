import 'angular-mocks';
import './sbgOnRenderComplete.js';

describe('directives', function() {

    var tiles = [
        {
            'ID': 1,
            'title': 'Account 1',
            'visible': true,
            'width': 3,
            'height': 2,
            'content': 'Content for Account 1'
        },
        {
            'ID': 2,
            'title': 'Account 2',
            'visible': true,
            'width': 3,
            'height': 4,
            'content': 'Content for Account 2'
        },
        {
            'ID': 3,
            'title': 'Account 3',
            'visible': true,
            'width': 6,
            'height': 4,
            'content': 'Content for Account 3'
        }
    ];

    beforeEach(angular.mock.module('sbgOnRenderComplete'));

    describe('template', function() {

        var $compile;
        var $scope;

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
        }));

        it('should emit a finished event once ngRepeat is complete', inject(function($httpBackend) {
            spyOn($scope, '$emit');
            $scope.items = tiles;
            $compile(angular.element('<div ng-repeat="item in items" tile="item" sbg-on-render-complete>{{ item.content }}</div>'))($scope);
            $scope.$digest();
            if ($scope.$last === true) {
                expect($scope.$emit).toHaveBeenCalledWith('ngRepeatFinished');
            }
        }));
    });
});
