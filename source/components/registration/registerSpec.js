import 'angular-mocks';
import './login';

describe('login Directive', function() {

    beforeEach(function() {
        angular.mock.module('cn.login');
    });

    describe('template', function() {

        var $compile;
        var $scope;

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
        }));

        it('should not call login when input is invalid', inject(function($httpBackend, $state) {
            //login.get.and.returnValue({});
            var element = angular.element('<cn-login></cn-login>');
            $compile(element)($scope);
            $scope.$digest();
            var userName = element.find('#userName');
            var pwd = element.find('#password');
            userName.val('foobar.co.za');
            pwd.val('moofoo');
            userName.trigger('input');
            pwd.trigger('input');
            var mySpy = spyOn(element.isolateScope().ctrl, 'checkUser');
            var smallButton = element.find('md-button')[ 0 ];
            smallButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        }));
    });
});
