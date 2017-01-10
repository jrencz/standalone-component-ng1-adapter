import TestStandaloneComponent from 'test-standalone-component';

class TestStandaloneComponentController {
  constructor(
    $element,
    $timeout,
    $rootScope
  ) {
    'ngInject';

    // Treating external component as a parent is one way of using it.
    // super('#test-component', config);
    // This way our own controller may name-clash with the wrapped one and that's why it's not a prefereable way.
    // Other may be to call imported function and assign what it returns (the API object) to this controller.
    this.wrappedComponentController = new TestStandaloneComponent($element, {
      // Example input
      name: 'Initial name (set in application)',
      onClicked: () => {
        if (typeof this.onClicked === 'function') {
          if (this.delayedOnClicked) {
            $timeout(1000).then(() => {
              this.onClicked();
            });
          } else {
            // $apply tells Angular something changed. It will always be needed in facades.
            $rootScope.$apply(() => {
              this.onClicked();
            });
          }
        }
      }
    });
  }

  $onInit() {
    // This is the api of external component.
    this.wrappedComponentController.setRTL(this.isRightToLeft);
    this.wrappedComponentController.render();
  }

  handleNameChange(change) {
    if (change.isFirstChange()) {
      return;
    }

    this.wrappedComponentController.changeName(change.currentValue);
  }

  handleIsRightToLeftChangeChange(change) {
    if (change.isFirstChange()) {
      return;
    }

    this.wrappedComponentController.setRTL(change.currentValue);
  }

  $onChanges(changes) {
    if ('name' in changes) {
      this.handleNameChange(changes.name);
    }
    if ('isRightToLeft' in changes) {
      this.handleIsRightToLeftChangeChange(changes.isRightToLeft);
    }
  }
}

export default TestStandaloneComponentController;
