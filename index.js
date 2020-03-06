/**
 * @format
 */

/*import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
*/
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import {createStore, combineReducers} from 'redux';
import configureStore from './configureStore';
import App from './src/navigators';
import './ReactotronConfig';
if (__DEV__) {
}

// A very simple store
let store = configureStore();

class IddesAgro extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => IddesAgro);
