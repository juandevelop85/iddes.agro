import {combineReducers} from 'redux';
import {createNavigationReducer} from 'react-navigation-redux-helpers';
import alicanState from './appStore';
import navState from './navStore';
import {AppNavigator} from '../navigators';

const navReducer = createNavigationReducer(AppNavigator);

const AppReducer = combineReducers({
  nav: navReducer,
  alicanState,
  navState,
});

export default AppReducer;
