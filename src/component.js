import controller from './controller';
import './index.scss'

const testStandaloneNgComponent = {
  bindings: {
    name: '<',
    isRightToLeft: '<',
    onClicked: '&',
    delayedOnClicked: '<',
  },
  controller
};

export default testStandaloneNgComponent;
