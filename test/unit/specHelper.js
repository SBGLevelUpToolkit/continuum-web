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
    compileDirective: function(directive, ctrlName = 'ctrl') {
        let scope,
            elm,
            ctrl;

        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            elm = angular.element('<' + directive + '></' + directive + '>');
            $compile(elm)(scope);
            scope.$digest();
            ctrl = elm.scope()[ctrlName];
            if (!ctrl) {
                ctrl = elm.isolateScope()[ctrlName];
            }
        });

        return {
            scope: scope,
            ctrl: ctrl,
            elm: elm
        };
    },

    getMock: function(fileName) {
        return load(`base/test/unit/mocks/${fileName}.json`);
    }
};