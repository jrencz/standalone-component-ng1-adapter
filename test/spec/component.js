import AdapterModule from '../../src/';

import {mock} from 'angular';

const {
  module,
  inject
} = mock;

describe(`Module: ${ AdapterModule }`, () => {
  let $compile;
  let $rootScope;

  beforeEach(module(AdapterModule));

  describe('Adapter component', () => {
    beforeEach(inject((
      _$compile_,
      _$rootScope_
    ) => {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('Renders the standalone component', () => {
      const element = $compile(
        '<test-standalone-component-adapter></test-standalone-component-adapter>'
      )($rootScope);

      $rootScope.$digest();

      expect(element.html()).toContain('Content from standalone component');
    });

    describe('when name changes', () => {

    });
  })
});
