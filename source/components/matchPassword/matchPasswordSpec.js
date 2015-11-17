import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './matchPassword';

describe('MatchPassword Directive', function() {

    let directive,
        html = [
            '<form name="TestForm">',
            '<input name="password" ng-model="password">',
            '<input name="confirmPassword" cn-match-password="password" ng-model="confirmPassword">',
            '<input type="submit" name="submit" value="submit" />',
            '</form>'
        ].join('\n');

    beforeEach(function() {
        angular.mock.module('cn.matchPassword');
    });

    beforeEach(function() {
        directive = helper.compileDirective(html, null, true);
    });

    describe('When passwords match', function() {
        it('Then the confirmPassword field should be in a valid state', function() {
            //compile();
            directive.scope.TestForm.password.$setViewValue('samePassword');
            directive.scope.TestForm.confirmPassword.$setViewValue('samePassword');
            directive.scope.TestForm.$setSubmitted(true);
            directive.scope.$digest();

            expect(directive.scope.TestForm.confirmPassword.$valid).toBe(true);
            expect(directive.scope.TestForm.confirmPassword.$error.passwordMatch).toBeUndefined();
        });

    });

    describe('When passwords do not match', function() {
        it('Then the confirmPassword field should be in an invalid state', function() {
            //compile();
            directive.scope.TestForm.password.$setViewValue('samePassword');
            directive.scope.TestForm.confirmPassword.$setViewValue('notTheSamePassword');
            directive.scope.TestForm.$setSubmitted(true);
            directive.scope.$digest();

            expect(directive.scope.TestForm.confirmPassword.$valid).toBe(false);
            expect(directive.scope.TestForm.confirmPassword.$error.passwordMatch).toEqual(true);
        });
    });
});