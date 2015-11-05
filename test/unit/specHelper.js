'use strict';

import angular from 'angular';
import 'angular-mocks';

window.ngModule = angular.mock.module;

function load(url) {
    let data;
    $.ajax({
        dataType: 'json',
        url: url,
        async: false,
        success: function(result) {
            data = result;
        }
    });
    return data;
}

export default {
    compileDirective: function(directive) {
        var scope,
            elm,
            ctrl;

        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            elm = angular.element('<' + directive + '></' + directive + '>');
            $compile(elm)(scope);
            scope.$digest();
            ctrl = elm.scope().ctrl;
            if (!ctrl) {
                ctrl = elm.isolateScope().ctrl;
            }
        });

        return {
            scope: scope,
            ctrl: ctrl,
            elm: elm
        };
    },

    getDimensions: function() {
        return load('base/test/unit/mocks/dimensions.json').dimensions;
    },

    getDimension: function() {
        return load('base/test/unit/mocks/dimension.json').dimension;
    },

    getScore: function() {
        return load('base/test/unit/mocks/score.json');
    },

    getAssessments: function() {
        return load('base/test/unit/mocks/assessments.json');
    },

    getTeams: function() {
        return load('base/test/unit/mocks/teams.json');
    },

    getUsers: function() {
        return load('base/test/unit/mocks/users.json');
    }
};