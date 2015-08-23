import 'angular-mocks';

describe('directives', function() {

    beforeEach(angular.mock.module('Continuum'));

    describe('template', function() {

        var $compile;
        var $scope;

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
        }));

    });
});
