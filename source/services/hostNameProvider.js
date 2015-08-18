import angular from 'angular';
import environment from '../config/environment';

var app = angular.module('hostName', []);
app.provider('hostName', function() {
    var hostName;

    this.setHost = function(value) {
        var values = value.split('.');
        hostName = environment[values[1]];
    };

    this.$get = function() {
        return hostName;
    };
});

export default app;