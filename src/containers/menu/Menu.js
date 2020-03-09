import React from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {connect} from 'react-redux';

import {StackActions, CommonActions} from '@react-navigation/native';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiY2xldmVydGhpbmdzaW8iLCJhIjoiY2sxeWJ3MjlxMDB3MTNucGN6OHNla2NyZyJ9.B4zqV-Ej0lrL8CLyiUR6AA',
);

const styles = StyleSheet.create({
  percentageText: {
    padding: 8,
    textAlign: 'center',
  },
  buttonCnt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: 'blue',
    padding: 8,
  },
  buttonTxt: {
    color: 'white',
  },
});

class CreateOfflineRegion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: `test-${Date.now()}`,
    };
  }

  componentWillUnmount() {}

  render() {
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            this.props.changeScreen(this.props.navigation, 'ViewIrrigationInfo')
          }>
          <View style={styles.button}>
            <Text style={styles.buttonTxt}>Ir</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    modalVisible: state.iddesagroState.modalVisible,
    modalData: state.iddesagroState.modalData,
    selectedDirection: state.iddesagroState.selectedDirection,
    fetchData: state.iddesagroState.fetchData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setVisibleBuyModal: visible => dispatch(setVisibleBuyModal(visible)),
    registerProductInCart: item => dispatch(registerProductInCart(item)),
    changeScreen: (navigation, route, params) =>
      navigation.dispatch(CommonActions.navigate({name: route, params})),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateOfflineRegion);
