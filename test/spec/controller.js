import AdapterModule from '../../src/';
import Controller from '../../src/controller';
import TestStandaloneComponent from 'test-standalone-component';

import {
  mock,
  element
} from 'angular';

const {
  module,
  inject
} = mock;

const {
  any,
  createSpy,
} = jasmine;

const {
  spyOn,
  beforeEach,
  describe,
  it,
} = window;

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
      ).toEqual(any(TestStandaloneComponent));
    });

    describe('when adapter is initialized', () => {
      let ctrl;

      beforeEach(() => {
        ctrl = createCtrl();
      });

      it('should render wrapped controller', () => {
        spyOn(ctrl.wrappedComponentController, 'render');

        ctrl.$onInit();

        expect(
          ctrl.wrappedComponentController.render
        ).toHaveBeenCalledOnce()
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

          expect(ctrl.wrappedComponentController.name).not.toBe(name);
        });

        it('should use custom value', () => {
          ctrl.$onInit();

          expect(
            ctrl.wrappedComponentController.name
          ).toStartWith('Initial name');
        });
      });

      describe('when value changes', () => {
        beforeEach(() => {
          spyOn(ctrl.wrappedComponentController, 'changeName');
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

            expect(
              ctrl.wrappedComponentController.changeName
            ).not.toHaveBeenCalled();
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

            expect(
              ctrl.wrappedComponentController.changeName
            ).toHaveBeenCalledOnce();
            expect(
              ctrl.wrappedComponentController.changeName
            ).toHaveBeenCalledOnceWith(currentValue);
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
          ).toEqual(isRightToLeft);
        });
      });

      describe('when value changes', () => {

        beforeEach(() => {
          spyOn(ctrl.wrappedComponentController, 'setRTL');
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

            expect(
              ctrl.wrappedComponentController.setRTL
            ).not.toHaveBeenCalled();
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

            expect(
              ctrl.wrappedComponentController.setRTL
            ).toHaveBeenCalledOnce();
            expect(
              ctrl.wrappedComponentController.setRTL
            ).toHaveBeenCalledOnceWith(currentValue);
          });
        })
      });
    });

    describe('`onClicked` binding', () => {
      let onClicked;
      let ctrl;

      describe('when value is function', () => {
        beforeEach(() => {
          onClicked = createSpy();
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

            expect(
              onClicked
            ).toHaveBeenCalledOnce();
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
            }).not.toThrow();
          });
        });
      });

      describe('when value changes', () => {
        let updatedOnClicked;

        beforeEach(() => {
          onClicked = createSpy();
          updatedOnClicked = createSpy();

          ctrl = createCtrl({
            bindings: {
              onClicked,
            }
          });
          ctrl.$onInit();
        });

        it('should call the current value (function)', () => {
          ctrl.wrappedComponentController.node.click();

          expect(
            onClicked
          ).toHaveBeenCalledOnce();
          expect(
            updatedOnClicked
          ).not.toHaveBeenCalled();

          ctrl.$onChanges({
            onClicked: {
              isFirstChange: () => false,
              previousValue: onClicked,
              currentValue: updatedOnClicked,
            }
          });
          ctrl.onClicked = updatedOnClicked;

          ctrl.wrappedComponentController.node.click();

          expect(
            onClicked
          ).toHaveBeenCalledOnce();
          expect(
            updatedOnClicked
          ).toHaveBeenCalledOnce();
        });
      });
    });

    describe('`delayedOnClicked` binding', () => {
      let onClicked;
      let ctrl;

      beforeEach(() => {
        onClicked = createSpy();
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

          expect(
            onClicked
          ).not.toHaveBeenCalled();

          $timeout.flush(999);

          expect(
            onClicked
          ).not.toHaveBeenCalled();

          $timeout.flush(1);

          expect(
            onClicked
          ).toHaveBeenCalledOnce();
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

          expect(
            onClicked
          ).toHaveBeenCalledOnce();
        });
      });
    });
  })
});
