import AdapterModule from '../../src/';

import {expect} from 'chai';
import {mock} from 'angular';

describe(`Module: ${ AdapterModule }`, () => {
  let $compile;
  let $rootScope;

  beforeEach(mock.module(AdapterModule));

  describe('Adapter component', () => {
    beforeEach(mock.inject((
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

      expect(element.html()).to.contain('Content from standalone component');
    });

    describe('when name changes', () => {

    });
  })
});
