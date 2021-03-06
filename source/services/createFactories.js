import angular from 'angular';
import createResourceFactory from './factoryUtil';

let assessmentOperations = function(fullPath) {
    return {
        create: {
            method: 'POST',
            url: `${fullPath}create`
        },

        moderate: {
            method: 'POST',
            url: `${fullPath}moderate`
        },
        close: {
            method: 'POST',
            url: `${fullPath}close`
        },
        reopen: {
            method: 'POST',
            url: `${fullPath}reopen`
        },
        score: {
            method: 'GET',
            url: `${fullPath}score`
        }
    };
};

let teamOperations = function(fullPath) {
    return {
        join: {
            method: 'POST',
            url: `${fullPath}:Id/join`
        }
    };
};

let factories = [
    { name: 'dimension', isArray: true },
    { name: 'assessment', isArray: false, operations: assessmentOperations },
    { name: 'team', isArray: true, operations: teamOperations },
    { name: 'goal', isArray: true },
    { name: 'user', isArray: false }
];

factories.forEach(createResourceFactory);