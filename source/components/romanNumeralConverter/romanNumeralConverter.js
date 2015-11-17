var app = angular.module('cn.romanNumeralConverter', [])
    .directive('cnRomanNumeralConverter', function() {
        return {
            restrict: 'E',
            controllerAs: 'ctrl',
            bindToController: true,
            controller: function controller() {
                function convertFirstThree(digit) {

                }
                this.convert = function(numberToconvert) {
                    let result;
                    let firstDigit = [
                        '',
                        'I',
                        'II',
                        'III',
                        'IV',
                        'V',
                        'VI',
                        'VII',
                        'VIII',
                        'IX'
                    ];

                    let secondDigit = [
                        'X',
                        'X',
                        'X',
                        'XC',
                        'C',
                        'CX',
                        'CXX',
                        'CXXX',
                        'XC',
                        'D'
                    ];

                    result = firstDigit[ numberToconvert ];
                    return result;
                };
            }
        };
    });

export default app;