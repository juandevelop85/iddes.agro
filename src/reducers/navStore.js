import {NavigationActions} from 'react-navigation';
import {AppNavigator} from '../navigators';

const firstAction = AppNavigator.router.getActionForPathAndParams('Splash');
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

function navState(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Splash':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({routerName: 'Splash'}),
        state,
      );
      break;

    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

export default navState;
