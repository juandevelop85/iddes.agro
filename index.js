/**
 * @format
 */

/*import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
*/

/**
 * @format
 */

/*import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);*/

import {Provider} from 'react-redux';
import React from 'react';
import {name as appName} from './app.json';
import {AppRegistry} from 'react-native';
import configureStore from './configureStore';
import {AppWithNavigationState} from './src/navigators';
import './ReactotronConfig';
if (__DEV__) {
}

const store = configureStore();

class ChristusTelemedicina extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => ChristusTelemedicina);
