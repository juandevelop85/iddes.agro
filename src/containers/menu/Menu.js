import React from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {connect} from 'react-redux';

import {StackActions, CommonActions} from '@react-navigation/native';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiY2xldmVydGhpbmdzaW8iLCJhIjoiY2sxeWJ3MjlxMDB3MTNucGN6OHNla2NyZyJ9.B4zqV-Ej0lrL8CLyiUR6AA',
);

const IS_ANDROID = Platform.OS === 'android';

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
  noPermissionsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

class CreateOfflineRegion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: `test-${Date.now()}`,
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false,
    };
  }

  async componentDidMount() {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
  }

  componentWillUnmount() {}

  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <SafeAreaView
          style={[sheet.matchParent, {backgroundColor: colors.primary.blue}]}
          forceInset={{top: 'always'}}>
          <View style={sheet.matchParent}>
            <Text style={styles.noPermissionsText}>
              You need to accept location permissions in order to use this
              example applications
            </Text>
          </View>
        </SafeAreaView>
      );
    }
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            this.props.changeScreen(this.props.navigation, 'ViewIrrigationInfo')
          }>
          <View style={styles.button}>
            <Text style={styles.buttonTxt}>Ver señalizaciones</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.props.changeScreen(this.props.navigation, 'SignalPlots')
          }>
          <View style={styles.button}>
            <Text style={styles.buttonTxt}>Señalizar</Text>
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
