import AdapterModule from '../../src/';
import Controller from '../../src/controller';
import TestStandaloneComponent from 'test-standalone-component';

import {
  expect
} from 'chai';

import {
  assert,
  spy,
} from 'sinon';

import {
  mock,
  element
} from 'angular';

const {
  module,
  inject
} = mock;

describe(`Module: ${ AdapterModule }`, () => {
  let $componentController;

  beforeEach(module(AdapterModule));
  beforeEach(inject((_$componentController_) => {
    $componentController = _$componentController_;
  }));

  describe('Controller', () => {
    let createCtrl;

    beforeEach(() => {
      createCtrl = ({
        locals = {
          $element: element(),
        },
        bindings,
      } = {}) => $componentController(
        'testStandaloneComponentAdapter',
        locals,
        bindings
      );

    });

    it('should expose a `wrappedComponentController` object', function() {
      const {
        wrappedComponentController
      } = createCtrl();

      expect(
        wrappedComponentController
      ).to.be.an.instanceOf(TestStandaloneComponent);
    });

    describe('when adapter is initialized', () => {
      let ctrl;

      beforeEach(() => {
        ctrl = createCtrl();
      });

      it('should render wrapped controller', () => {
        spy(ctrl.wrappedComponentController, 'render');

        ctrl.$onInit();

        assert.calledOnce(ctrl.wrappedComponentController.render);
      });
    });

    describe('`name` binding', () => {
      const name = 'initialValue';

      let ctrl;

      beforeEach(() => {
        ctrl = createCtrl({
          bindings: {
            name,
          }
        });
      });

      describe('known when adapter is initialized', () => {
        it('should ignore initial value', () => {
          ctrl.$onInit();

          expect(ctrl.wrappedComponentController.name).not.to.be.a(name);
        });

        it('should use custom value', () => {
          ctrl.$onInit();

          expect(
            ctrl.wrappedComponentController.name.startsWith('Initial name')
          ).to.be.ok;
        });
      });

      describe('when value changes', () => {
        beforeEach(() => {
          spy(ctrl.wrappedComponentController, 'changeName');
        });

        describe('first time', () => {
          const isFirstChange = () => true;

          it('should not pass the name to the component', () => {
            ctrl.$onChanges({
              name: {
                isFirstChange,
                previousValue: undefined,
                currentValue: name,
              }
            });

            assert.notCalled(
              ctrl.wrappedComponentController.changeName
            );
          });
        });

        describe('another time', () => {
          const isFirstChange = () => false;

          it('should pass the name to the component', () => {
            const currentValue = `${ name } changed`;

            ctrl.$onChanges({
              name: {
                isFirstChange,
                previousValue: name,
                currentValue,
              }
            });

            assert.calledOnce(ctrl.wrappedComponentController.changeName);
            assert.calledWith(
              ctrl.wrappedComponentController.changeName, currentValue);
          });
        })
      });
    });

    describe('`isRightToLeft` binding', () => {
      const isRightToLeft = true;

      let ctrl;

      beforeEach(() => {
        ctrl = createCtrl({
          bindings: {
            isRightToLeft,
          }
        });
      });

      describe('known when adapter is created', () => {
        it('should pass initial value', () => {
          ctrl.$onInit();

          expect(
            ctrl.wrappedComponentController.isRTL
          ).to.be.equal(isRightToLeft);
        });
      });

      describe('when value changes', () => {

        beforeEach(() => {
          spy(ctrl.wrappedComponentController, 'setRTL');
        });

        describe('first time', () => {
          const isFirstChange = () => true;

          it('should not pass the name to the component', () => {
            ctrl.$onChanges({
              isRightToLeft: {
                isFirstChange,
                previousValue: undefined,
                currentValue: isRightToLeft,
              }
            });

            assert.notCalled(
              ctrl.wrappedComponentController.setRTL
            );
          });
        });

        describe('another time', () => {
          const isFirstChange = () => false;

          it('should pass the name to the component', () => {
            const currentValue = !isRightToLeft;

            ctrl.$onChanges({
              isRightToLeft: {
                isFirstChange,
                previousValue: isRightToLeft,
                currentValue,
              }
            });

            assert.calledOnce(ctrl.wrappedComponentController.setRTL);
            assert.calledWith(
              ctrl.wrappedComponentController.setRTL, currentValue);
          });
        })
      });
    });

    describe('`onClicked` binding', () => {
      let onClicked;
      let ctrl;

      describe('when value is function', () => {
        beforeEach(() => {
          onClicked = spy();
          ctrl = createCtrl({
            bindings: {
              onClicked,
            }
          });
          ctrl.$onInit();
        });

        describe('and component is clicked', () => {
          it('should be called immediately', () => {
            ctrl.wrappedComponentController.node.click();

            assert.calledOnce(onClicked);
          });
        });
      });

      describe('when value is not a function', () => {
        beforeEach(() => {
          onClicked = null;
          ctrl = createCtrl({
            bindings: {
              onClicked,
            }
          });
          ctrl.$onInit();
        });

        describe('and component is clicked', () => {
          it('should not throw', () => {
            expect(() => {
              ctrl.wrappedComponentController.node.click();
            }).not.to.throw();
          });
        });
      });

      describe('when value changes', () => {
        let updatedOnClicked;

        beforeEach(() => {
          onClicked = spy();
          updatedOnClicked = spy();

          ctrl = createCtrl({
            bindings: {
              onClicked,
            }
          });
          ctrl.$onInit();
        });

        it('should call the current value (function)', () => {
          ctrl.wrappedComponentController.node.click();

          assert.calledOnce(onClicked);
          assert.notCalled(updatedOnClicked);

          ctrl.$onChanges({
            onClicked: {
              isFirstChange: () => false,
              previousValue: onClicked,
              currentValue: updatedOnClicked,
            }
          });
          ctrl.onClicked = updatedOnClicked;

          ctrl.wrappedComponentController.node.click();

          assert.calledOnce(onClicked);
          assert.calledOnce(updatedOnClicked);
        });
      });
    });

    describe('`delayedOnClicked` binding', () => {
      let onClicked;
      let ctrl;

      beforeEach(() => {
        onClicked = spy();
      });

      describe('when set to true', () => {
        const delayedOnClicked = true;

        let $timeout;
        beforeEach(inject((_$timeout_) => {
          $timeout = _$timeout_;

          ctrl = createCtrl({
            bindings: {
              onClicked,
              delayedOnClicked,
            }
          });
          ctrl.$onInit();
        }));

        it('should delay calling `onClicked` by 1s', () => {
          ctrl.wrappedComponentController.node.click();

          assert.notCalled(onClicked);

          $timeout.flush(999);

          assert.notCalled(onClicked);

          $timeout.flush(1);

          assert.calledOnce(onClicked);
        });
      });

      describe('when set to false', () => {
        const delayedOnClicked = false;

        beforeEach(() => {
          ctrl = createCtrl({
            bindings: {
              onClicked,
              delayedOnClicked,
            }
          });
          ctrl.$onInit();
        });

        it('should not delay calling `onClicked`', () => {
          ctrl.wrappedComponentController.node.click();

          assert.calledOnce(onClicked);
        });
      });
    });
  })
});
