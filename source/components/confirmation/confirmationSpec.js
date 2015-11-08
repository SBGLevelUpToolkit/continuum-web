import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './confirmation';

describe('Confirmation Directive', function() {

    let directive,
        authSpy,
        $httpBackend,
        $location,
        confirmationParams = '/confirmation?userId=foo@bar.co.za&code=gerHp0%2FNHDx20LcgZOoZ%2BbBqroZ%2F93MYQi&action=ConfirmEmail';

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('cn.confirmation');
    });

    beforeEach(inject(function(_$location_, _$httpBackend_, _authService_, $state) {
        $location = _$location_;
        $httpBackend = _$httpBackend_;
        authSpy = serviceSpy.auth.bind(this, _authService_);
        spyOn($state, 'go');
    }));

    describe('When the directive compiles', function() {
        it('it should call a service with the correct confirmation details', function() {
            $location.url(confirmationParams);
            $httpBackend.expect('POST',
                `undefined/api/account/ConfirmEmail?userId=foo@bar.co.za&code=gerHp0%2FNHDx20LcgZOoZ%2BbBqroZ%2F93MYQi`).respond(200);
            directive = helper.compileDirective('cn-confirmation');
            $httpBackend.flush();
        });

        describe('When the details are successfully confirmed', function() {
            it('it should navigate to login', inject(function($state) {
                authSpy().confirmEmail();
                directive = helper.compileDirective('cn-confirmation');
                expect($state.go).toHaveBeenCalled();
            }));
        });

        describe('When the details are not successfully confirmed', function() {
            it('it should set an invalid state', function() {
                authSpy(false).confirmEmail();
                directive = helper.compileDirective('cn-confirmation');
                expect(directive.ctrl.formInvalid).toEqual(true);
            });
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});