import 'angular-mocks';
import serviceSpy from '../../../test/unit/mocks/services';
import './resetPassword';

describe('ResetPassword Directive', function() {

    var directive,
        passPromise,
        authService,
        $httpBackend;

    beforeEach(function() {
        angular.mock.module('cn.resetPassword');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        directive = helper.compileDirective('cn-reset-password');
        spyOn($state, 'go');
        authService = _authService_;
        spyOn(authService, 'login').and.callFake(function() {
            return (passPromise) ? $q.when() : $q.reject();
        });
    }));

    describe('When the directive compiles', function() {

        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));

        it('should get all teams', inject(function() {
            $httpBackend.expectGET('undefined/api/team').respond(200, teams);
            expect(ctrl.teams.length).toEqual(4);
        }));
    });

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

        var mySpy = spyOn(elm.isolateScope().ctrl, 'login');
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

        var mySpy = spyOn(elm.isolateScope().ctrl, 'login');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();
    }));

    it('should pass a valid object to login', inject(function() {
        scope.$apply(function() {
            ctrl.user = {
                userName: 'br@ders.co.za',
                password: 'kensentme!'
            };
        });

        var mySpy = spyOn(elm.isolateScope().ctrl, 'login');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).toHaveBeenCalled();
    }));

    it('should call home state when authorization is successful', inject(function($state) {
        passPromise = true;

        var user = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

        ctrl.login(user);
        scope.$digest();
        expect($state.go).toHaveBeenCalledWith('home');
    }));

    it('should set an invalid property when authorization is unsuccessful', inject(function($state) {
        passPromise = false;

        var user = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

        ctrl.login(user);
        scope.$digest();
        expect($state.go).not.toHaveBeenCalled();
        expect(ctrl.formInvalid).toBe(true);
    }));
});