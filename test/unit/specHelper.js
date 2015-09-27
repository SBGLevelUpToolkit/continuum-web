'use strict';

import angular from 'angular';
import 'angular-mocks';

window.ngModule = angular.mock.module;

export default {
    getDimensions: function() {
        let dimensions;
        $.ajax({
            dataType: 'json',
            url: 'base/test/unit/mocks/dimensions.json',
            async: false,
            success: function(data) {
                dimensions = data.dimensions;
            }
        });
        return dimensions;
    },

    getDimension: function() {
        let dimension;
        $.ajax({
            dataType: 'json',
            url: 'base/test/unit/mocks/dimension.json',
            async: false,
            success: function(data) {
                dimension = data.dimension;
            }
        });
        return dimension;
    }
}