/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage} from 'react-native';
import {loadLocation, setCountCart} from '../../actions';
import {connect} from 'react-redux';
import {StackActions, NavigationActions} from 'react-navigation';
import {
  DATA_PRODUCT_STORE,
  DATA_USER_KEY,
  TOKEN_USER_KEY,
} from '../../lib/Constants';
import Reactotron from 'reactotron-react-native';

class Splash extends Component {
  componentDidMount() {
    this.validateSession().done();
  }

  validateSession = async () => {
    let dataUser = await AsyncStorage.getItem(TOKEN_USER_KEY);

    if (dataUser) {
      this.props.changeScreen('Menu');
    } else {
      this.props.changeScreen('Login');
    }
  };

  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.text}>alican</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#041952',
  },
  text: {
    color: '#EEEEEE',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 50,
  },
});

Splash.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
  return {
    dataStore: state.alicanState.dataStore,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadLocation: location => dispatch(loadLocation(location)),
    changeScreen: route =>
      dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: route})],
        }),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
