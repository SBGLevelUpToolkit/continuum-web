//import 'angular-mocks';
//import helper from '../../../test/unit/specHelper';
//import './romanNumeralConverter';
//
//describe('RomanNumeralConverter Directive', function() {
//
//    let directive;
//
//    beforeEach(function() {
//        angular.mock.module('cn.romanNumeralConverter');
//    });
//
//    beforeEach(function() {
//        directive = helper.compileDirective('cn-roman-numeral-converter');
//    });
//
//    let IResult = [ 'I', 'II', 'III' ];
//    for (let i = 1; i < 4; i++) {
//        describe(`When ${i} is entered`, function() {
//            it(`it should convert to ${IResult[ i - 1 ]}`, function() {
//                let result = directive.ctrl.convert(i);
//                expect(result).toEqual(IResult[ i - 1 ]);
//            });
//        });
//    }
//
//    describe('When 4 is entered', function() {
//        it('it should convert to IV', function() {
//            let result = directive.ctrl.convert(4);
//            expect(result).toEqual('IV');
//        });
//    });
//
//    describe('When 5 is entered', function() {
//        it('it should convert to V', function() {
//            let result = directive.ctrl.convert(5);
//            expect(result).toEqual('V');
//        });
//    });
//
//    describe('When 6 is entered', function() {
//        it('it should convert to VI', function() {
//            let result = directive.ctrl.convert(6);
//            expect(result).toEqual('VI');
//        });
//    });
//
//    describe('When 7 is entered', function() {
//        it('it should convert to VII', function() {
//            let result = directive.ctrl.convert(7);
//            expect(result).toEqual('VII');
//        });
//    });
//
//    describe('When 8 is entered', function() {
//        it('it should convert to VIII', function() {
//            let result = directive.ctrl.convert(8);
//            expect(result).toEqual('VIII');
//        });
//    });
//
//    describe('When 9 is entered', function() {
//        it('it should convert to IX', function() {
//            let result = directive.ctrl.convert(9);
//            expect(result).toEqual('IX');
//        });
//    });
//});