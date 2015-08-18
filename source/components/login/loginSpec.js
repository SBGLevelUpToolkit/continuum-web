import 'angular-mocks';
import './login';

describe('login  Directive', function() {

    beforeEach(function() {
        angular.mock.module('cnLogin');
        //angular.mock.module(function($provide) {
        //    $provide.value('login', jasmine.createSpyObj('login', [ 'get' ]));
        //});
    });

    describe('template', function() {

        var $compile;
        var $scope;

        beforeEach(inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
        }));

        it('should navigate to home if authorization is successful', inject(function($httpBackend, login, $state) {
            //login.get.and.returnValue({});
            var element = angular.element('<cn-login></cn-login>');
            var cElement = $compile(element)($scope);
            $scope.$digest();
            //var email = element.find("#email");
            //var pwd = element.find("#password");
            //email.val("foo@bar.co.za");
            //pwd.val("moofoo");
            //var mySpy = spyOn(element.isolateScope().ctrl, 'login');
            //element.isolateScope().ctrl.login({});
            var smallButton = cElement.find("md-button")[0];
            smallButton.click();
            expect(element.isolateScope().ctrl.brett).toEqual("uptfon")
            //expect(mySpy).toHaveBeenCalled();
        }));
    });
});
