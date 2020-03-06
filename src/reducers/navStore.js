import {CommonActions} from '@react-navigation/native';
import App from '../navigators';

const firstAction = App.router.getActionForPathAndParams('Splash');
const initialNavState = App.router.getStateForAction(firstAction);

function navState(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Splash':
      nextState = App.router.getStateForAction(
        CommonActions.navigate({routerName: 'Splash'}),
        state,
      );
      break;

    default:
      nextState = App.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

export default navState;
