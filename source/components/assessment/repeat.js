'use strict';

var app = angular.module('cn.repeat', [])
    .directive('cnRepeat', function($timeout) {
        return {
            link: function(scope, elm, attrs, ctrl) {
                if (scope.$parent.$first) {
                    var setStyle = function() {
                        var targetElement = elm.find('div')[ 0 ];

                        // Simulate a mouse event so the correct currentTarget is passed
                        var evt = new window.MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        targetElement.dispatchEvent(evt);
                    };
                    $timeout(setStyle, 0);
                }
            },
            scope: {},
            restrict: 'A'
        };
    });