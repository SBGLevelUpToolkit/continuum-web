import 'angular-mocks';
import './authFactory';
import './authInterceptorService';

function setAuthData(authService, localStorageService) {
    localStorageService.set('authorizationData', {
        token: 'some token',
        userName: 'br@ders.co.za'
    });
    authService.authentication.isAuth = true;
    authService.authentication.userName = 'br@ders.co.za';

}

describe('Security Services', function() {

    describe('AuthFactory', function() {

        var user = {
            userName: "br@ders.co.za",
            password: "kensentme"
        };

        beforeEach(function() {
            angular.mock.module('cn.auth');
        });

        describe('Login', function() {

            it('should set the content-type header', inject(function(authService, $httpBackend) {
                $httpBackend.expectPOST('undefined/token', undefined, function(headers) {
                    return headers[ 'Content-Type' ] == 'application/x-www-form-urlencoded';
                }).respond(201, '');

                authService.login(user);
                $httpBackend.flush();
            }));

            it('should store auth data when login is successful', inject(function(authService, $httpBackend, localStorageService) {
                // TODO Set token in post success response
                $httpBackend.expectPOST('undefined/token').respond(201, '');

                authService.login(user);
                $httpBackend.flush();

                var authData = localStorageService.get('authorizationData');
                expect(authData).toBeDefined();
                expect(authData.userName).toEqual('br@ders.co.za');
            }));

            it('should remove stored auth data when login is unsuccessful', inject(function(authService, $httpBackend, localStorageService) {
                setAuthData(authService, localStorageService);

                $httpBackend.expectPOST('undefined/token').respond(500, '');
                authService.login(user);

                $httpBackend.flush();

                var authData = localStorageService.get('authorizationData');
                expect(authData).toBeNull();
                expect(authService.authentication.isAuth).toEqual(false);
                expect(authService.authentication.userName).toEqual('');
            }));
        });

        describe('SaveRegistration', function() {

            it('should remove stored auth data when login is unsuccessful', inject(function(authService, localStorageService) {
                setAuthData(authService, localStorageService);

                authService.saveRegistration();

                var authData = localStorageService.get('authorizationData');
                expect(authData).toBeNull();
                expect(authService.authentication.isAuth).toEqual(false);
                expect(authService.authentication.userName).toEqual('');
            }));

            it('should call the register web service', inject(function($httpBackend, authService) {
                $httpBackend.expectPOST('undefined/api/account/register').respond(200, '');
                authService.saveRegistration();
                $httpBackend.flush();
            }));
        });

        describe('Logout', function() {

            it('should remove stored auth data when login is unsuccessful', inject(function(authService, localStorageService) {
                setAuthData(authService, localStorageService);

                authService.logOut();

                var authData = localStorageService.get('authorizationData');
                expect(authData).toBeNull();
                expect(authService.authentication.isAuth).toEqual(false);
                expect(authService.authentication.userName).toEqual('');
            }));
        });
    });

    describe('AuthInterceptor', function() {

        beforeEach(function() {
            angular.mock.module('cn.authInterceptor');
        });

        it('should intercept web service calls', inject(function() {

        }));

        it('should add authorization headers to the request', inject(function() {

        }));

        it('should redirect to login when authorization is unsuccessful', inject(function() {

        }));

        it('should return an error when the web service response returns an error', inject(function() {

        }));
    });
});