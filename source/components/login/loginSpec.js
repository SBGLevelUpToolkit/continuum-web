import 'angular-mocks';
import './login';

describe('Login Directive', function() {

    var scope,
        elm,
        ctrl,
        passPromise,
        authService,
        validUser = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

    beforeEach(function() {
        angular.mock.module('cn.login');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        var compile = _$compile_;
        scope = _$rootScope_.$new();

        elm = angular.element('<cn-login></cn-login>');
        compile(elm)(scope);
        scope.$digest();
        ctrl = elm.scope().ctrl;
    }));

    beforeEach(inject(function($state) {
        spyOn($state, 'go');
    }));

    beforeEach(inject(function(_authService_, $q) {
        authService = _authService_;
        spyOn(authService, 'login').and.callFake(function() {
            return (passPromise) ? $q.when() : $q.reject();
        });
    }));

    it('should bind the content', function() {
        var userName = elm.find('#userName'),
            password = elm.find('#password');

        expect(userName.text()).toBe('');
        expect(password.text()).toBe('');

        scope.$apply(function() {
            ctrl.user = {
                userName: 'br@ders.co.za',
                password: 'kensentme'
            };
        });

        expect(userName.val()).toBe('br@ders.co.za');
        expect(password.val()).toBe('kensentme');
    });

    it('should not call login when userName is invalid', inject(function() {
        scope.$apply(function() {
            ctrl.user = {
                password: 'kensentme!'
            };
        });

        var mySpy = spyOn(elm.scope().ctrl, 'login');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();

        ctrl.user.userName = 'brders.co.za';
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();
    }));

    it('should not call login when password is invalid', inject(function() {
        scope.$apply(function() {
            ctrl.user = {
                userName: 'br@ders.co.za'
            };
        });

        var mySpy = spyOn(elm.scope().ctrl, 'login');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();
    }));

    it('should pass a valid object to login', inject(function() {
        scope.$apply(function() {
            ctrl.user = validUser;
        });

        var mySpy = spyOn(elm.scope().ctrl, 'login');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).toHaveBeenCalled();
    }));

    it('should call home state when authorization is successful', inject(function($state) {
        passPromise = true;
        ctrl.login(validUser);
        scope.$digest();
        expect($state.go).toHaveBeenCalledWith('home');
    }));

    it('should set an invalid property when authorization is unsuccessful', inject(function($state) {
        passPromise = false;
        ctrl.login(validUser);
        scope.$digest();
        expect($state.go).not.toHaveBeenCalled();
        expect(ctrl.formInvalid).toBe(true);
    }));
});