import angular from 'angular';
import createResourceFactory from './factoryUtil';

let factories = [
    { name: 'dimension', isArray: true },
    { name: 'assessment', isArray: false },
    { name: 'team', isArray: true },
    { name: 'goal', isArray: true }
];
factories.forEach(createResourceFactory);