import 'angular-mocks';
import './authFactory';
import './authInterceptorService';
import '../../services/createFactories'

describe('Security', function() {

    function setAuthData() {
        localStorageService.set('authorizationData', {
            token: 'some token',
            userName: 'br@ders.co.za'
        });
        authService.authentication.isAuth = true;
        authService.authentication.userName = 'br@ders.co.za';
    }

    beforeEach(function() {
        angular.mock.module('cn.auth');
        angular.mock.module('cn.authInterceptor', function($httpProvider) {
            httpProviderIt = $httpProvider;
        });

        inject(function(_authService_, _localStorageService_, _authInterceptorService_) {
            authService = _authService_;
            localStorageService = _localStorageService_;
            authInterceptorService = _authInterceptorService_;
        })

        localStorageService.remove('authorizationData');
    });

    var authService, localStorageService, httpProviderIt, authInterceptorService;

    describe('AuthFactory', function() {

        var user = {
            userName: "br@ders.co.za",
            password: "kensentme"
        };

        describe('Login', function() {

            it('should set the content-type header', inject(function($httpBackend) {
                $httpBackend.expectPOST('undefined/token', undefined, function(headers) {
                    return headers[ 'Content-Type' ] == 'application/x-www-form-urlencoded';
                }).respond(201, '');

                authService.login(user);
                $httpBackend.flush();
            }));

            it('should store auth data when login is successful', inject(function($httpBackend) {
                // TODO Set token in post success response
                $httpBackend.expectPOST('undefined/token').respond(201, '');

                authService.login(user);
                $httpBackend.flush();

                var authData = localStorageService.get('authorizationData');
                expect(authData).toBeDefined();
                expect(authData.userName).toEqual('br@ders.co.za');
            }));

            it('should remove stored auth data when login is unsuccessful', inject(function($httpBackend) {
                setAuthData();

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

            it('should remove stored auth data when login is unsuccessful', function() {
                setAuthData();

                authService.saveRegistration();

                var authData = localStorageService.get('authorizationData');
                expect(authData).toBeNull();
                expect(authService.authentication.isAuth).toEqual(false);
                expect(authService.authentication.userName).toEqual('');
            });

            it('should call the register web service', inject(function($httpBackend) {
                $httpBackend.expectPOST('undefined/api/account/register').respond(200, '');
                authService.saveRegistration();
                $httpBackend.flush();
            }));
        });

        describe('Logout', function() {

            it('should remove stored auth data when login is unsuccessful', function() {
                setAuthData();

                authService.logOut();

                var authData = localStorageService.get('authorizationData');
                expect(authData).toBeNull();
                expect(authService.authentication.isAuth).toEqual(false);
                expect(authService.authentication.userName).toEqual('');
            });
        });
    });

    describe('AuthInterceptorService', function() {

        var token = 'Bearer some token';

        it('should have authInterceptorService be defined', function() {
            expect(authInterceptorService).toBeDefined();
        });

        it('should have no api token upon start up', function() {
            var authData = localStorageService.get('authorizationData');
            expect(authData).toBeNull();
        });

        describe('HTTP requests', function() {

            it('should have the authInterceptorService as an interceptor', function() {
                expect(httpProviderIt.interceptors).toContain('authInterceptorService');
            });

            it('should token in the headers when calling a web service', inject(function($http, $httpBackend) {
                setAuthData();
                $httpBackend.expect('GET', '/test', {}, function(headers) {
                    return headers[ 'Authorization' ] === token;
                }).
                    respond(function() {
                        return "";
                    });

                $http({ method: 'GET', url: '/test', data: {}, headers: {} });
                $httpBackend.flush();
            }));

            it('should not place a token in the http request headers if no token is set', function() {
                var config = authInterceptorService.request({ headers: {} });
                expect(config.headers[ 'Authorization' ]).toBe(undefined);
            });

            it('should place a token in the http request headers after a token is set', function() {
                setAuthData();
                var config = authInterceptorService.request({ headers: {} });
                expect(config.headers[ 'Authorization' ]).toBe(token);
            });
        });

    });

});