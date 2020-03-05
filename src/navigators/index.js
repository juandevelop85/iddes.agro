import {createStackNavigator} from 'react-navigation';
import {connect} from 'react-redux';
import {createReduxContainer} from 'react-navigation-redux-helpers';

import Splash from '../containers/general/Splash';
import Menu from '../containers/menu/Menu';

const AppNavigator = createStackNavigator({
  Splash: {screen: Splash},
  Menu: {screen: Menu},
});

const App = createReduxContainer(AppNavigator);

const mapStateToProps = state => ({
  state: state.nav,
});

const AppWithNavigationState = connect(mapStateToProps)(App);

export {AppNavigator, AppWithNavigationState};
