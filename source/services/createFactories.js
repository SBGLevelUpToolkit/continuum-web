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
        }
    };
};

let factories = [
    { name: 'dimension', isArray: true },
    { name: 'assessment', isArray: false, operations: assessmentOperations },
    { name: 'team', isArray: true },
    { name: 'goal', isArray: true },
    { name: 'user', isArray: false }
];

factories.forEach(createResourceFactory);