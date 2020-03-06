/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {loadLocation, setCountCart} from '../../actions';
import AsyncStorage from '@react-native-community/async-storage';

import {connect} from 'react-redux';

import {StackActions, CommonActions} from '@react-navigation/native';
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
    Reactotron.log({errorcito: this.props});
    if (dataUser) {
      this.props.changeScreen(this.props.navigation, 'Menu');
    } else {
      this.props.changeScreen(this.props.navigation, 'Menu');
    }
  };

  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.text}>Iddes.agro</Text>
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
    //fontFamily: 'Comfortaa-Bold',
    fontSize: 50,
  },
});

const mapStateToProps = state => {
  return {
    dataStore: state.iddesagroState.dataStore,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadLocation: location => dispatch(loadLocation(location)),
    changeScreen: (navigation, route) =>
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: route}],
        }),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
