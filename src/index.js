import angular from 'angular';
import testStandaloneComponentAdapter from './component';

const testStandaloneComponentAdapterModule = angular
  .module('testStandaloneComponentAdapter', [
    // ng modules dependencies
  ])

  .component('testStandaloneComponentAdapter', testStandaloneComponentAdapter)
;

export default testStandaloneComponentAdapterModule.name;
