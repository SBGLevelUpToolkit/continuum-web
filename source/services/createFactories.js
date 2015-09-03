import angular from 'angular';
import createResourceFactory from './factoryUtil';

let factories = [ 'dimension', 'capability', 'assessment', 'team', 'goal' ];
factories.forEach(createResourceFactory);