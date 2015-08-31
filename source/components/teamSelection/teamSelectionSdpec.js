import 'angular-mocks';
import './teamSelection';

describe('TeamSelection Directive', function() {

    var scope,
        elm,
        ctrl,
        passPromise;

    beforeEach(function() {
        angular.mock.module('cn.teamSelection');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        var compile = _$compile_;
        scope = _$rootScope_.$new();

        elm = angular.element('<cn-team-selection></cn-team-selection>');
        compile(elm)(scope);
        scope.$digest();
        ctrl = elm.isolateScope().ctrl;
    }));

    beforeEach(inject(function($state) {
        spyOn($state, 'go');
    }));

    beforeEach(inject(function(_teamService_, $q) {
        var teamService = _teamService_;
        spyOn(teamService, 'saveTeam').and.callFake(function() {
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

    it('should not call register when userName is invalid', inject(function() {
        scope.$apply(function() {
            ctrl.user = {
                password: 'kensentme!'
            };
        });

        var mySpy = spyOn(elm.isolateScope().ctrl, 'register');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();

        ctrl.user.userName = 'brders.co.za';
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();
    }));

    it('should not call register when password is invalid', inject(function() {
        scope.$apply(function() {
            ctrl.user = {
                userName: 'br@ders.co.za'
            };
        });

        var mySpy = spyOn(elm.isolateScope().ctrl, 'register');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();
    }));

    it('should call teamSelection state when registration is successful', inject(function(authService, $state) {
        passPromise = true;

        var user = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

        ctrl.register(user);
        scope.$digest();
        expect($state.go).toHaveBeenCalledWith('teamSelection');
    }));

    it('should set an invalid property when authorization is unsuccessful', inject(function(authService, $state) {
        passPromise = false;

        var user = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

        ctrl.register(user);
        scope.$digest();
        expect($state.go).not.toHaveBeenCalled();
        expect(ctrl.formInvalid).toBe(true);
    }));
});