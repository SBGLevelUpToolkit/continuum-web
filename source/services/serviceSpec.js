import 'angular-mocks';
import './hostNameProvider';

describe('hostnameProvider', function() {

    var provider;

    beforeEach(angular.mock.module('cn.hostName', function(hostNameProvider) {
        provider = hostNameProvider;
    }));

    it('should return the correct host name', inject(function() {
        provider.setHost('~~ENVIRONMENT.LOCAL');
        expect(provider.$get()).toEqual('http://localhost:8887');
    }));
});