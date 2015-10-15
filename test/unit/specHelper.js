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
    }
};