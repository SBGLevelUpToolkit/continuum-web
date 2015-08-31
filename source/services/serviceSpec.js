import 'angular-mocks';
import './hostNameProvider';
import createResourceFactory from './factoryUtil';

describe('Factory', function() {

    describe('Hostname Provider', function() {

        var provider;

        beforeEach(angular.mock.module('cn.hostName', function(hostNameProvider) {
            provider = hostNameProvider;
        }));

        it('should return the correct host name', inject(function() {
            provider.setHost('~~ENVIRONMENT.LOCAL');
            expect(provider.$get()).toEqual('http://localhost:8887');
        }));
    });

    describe('CreateFactory', function() {
        it('should create a factory', inject(function() {
            //createResourceFactory('broders');

        }));
    });
});