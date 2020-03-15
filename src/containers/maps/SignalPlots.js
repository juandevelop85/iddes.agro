import React from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Switch,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import geoViewport from '@mapbox/geo-viewport';
import {connect} from 'react-redux';
import {Item, Input, Button, Text, Icon, Picker} from 'native-base';
const {width, height} = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {setVisibleModal} from '../../actions';

import sheet from '../../styles/sheet';
import gridPattern from '../../../assets/grid_pattern.png';
import smileyFaceGeoJSON from '../../../assets/smiley_face.json';

import BaseExamplePropTypes from '../../component/general/BaseExamplePropTypes';
import Page from '../../component/general/Page';
import Bubble from '../../component/general/Bubble';
import IrrigationInfo from '../../component/irrigation/DataModal';

import colors from '../../styles/colors';
import Reactotron from 'reactotron-react-native';

import styles from '../../styles/SignalPlotsStyles';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiY2xldmVydGhpbmdzaW8iLCJhIjoiY2sxeWJ3MjlxMDB3MTNucGN6OHNla2NyZyJ9.B4zqV-Ej0lrL8CLyiUR6AA',
);

const CENTER_COORD = [-76.539554, 3.404657];
const MAPBOX_VECTOR_TILE_SIZE = 512;

const layerStyles = {
  background: {
    backgroundPattern: gridPattern,
  },
  smileyFace: {
    fillAntialias: true,
    fillColor: 'red',
    fillOpacity: 0.3,
    fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
  },
};

let automaticSignalingPoints = [];
let manualSignalingPoints = [];

class SignalPlots extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: `test-${Date.now()}`,
      offlineRegion: null,
      offlineRegionStatus: null,
      offlineVisible: false,
      observation: '',
      suerte: '',
      suerteAge: '',
      suerteName: '',
      variety: '',
      hts: '',
      ranchSelect: [
        {name_es: 'Hacienda Cañasgordas', id: '1'},
        {name_es: 'Hacienda Sachamate', id: '2'},
      ],
      selected: '0',
      centerLocation: [-76.539554, 3.404657],
      initSignalingIcon: 'ios-play',
      startSignaling: false, //Para indicar que se inicio la toma de geolocalizacion
      typeSignal: false, //Indica que forma de toma de latitud y longitud se esta haciendo, manual = true, automatica = false
      isSignaling: false, //Para indicar si la toma de la geolocalizacion esta en pausa y activa
      automaticallySignal: false, //Para indicar que se esta tomando la geolocalizacion de forma automatica
      signalManually: false, //Para indicar que se esta tomando la geolocalizacion de forma manual
      geoJSON: smileyFaceGeoJSON,
      currentCoords: [],
    };

    this.onDownloadProgress = this.onDownloadProgress.bind(this);
    this.onDidFinishLoadingStyle = this.onDidFinishLoadingStyle.bind(this);

    this.onResume = this.onResume.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onStatusRequest = this.onStatusRequest.bind(this);
    this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);
  }

  componentWillUnmount() {
    // avoid setState warnings if we back out before we finishing downloading
    MapboxGL.offlineManager.deletePack(this.state.name);
    MapboxGL.offlineManager.unsubscribe('test');
  }

  async onDidFinishLoadingStyle() {
    const {width, height} = Dimensions.get('window');
    const bounds = geoViewport.bounds(
      CENTER_COORD,
      12,
      [width, height],
      MAPBOX_VECTOR_TILE_SIZE,
    );

    const options = {
      name: this.state.name,
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      minZoom: 10,
      maxZoom: 20,
    };

    // start download
    MapboxGL.offlineManager.createPack(options, this.onDownloadProgress);
  }

  onDownloadProgress(offlineRegion, offlineRegionStatus) {
    this.setState({
      name: offlineRegion.name,
      offlineRegion,
      offlineRegionStatus,
    });
  }

  onResume() {
    if (this.state.offlineRegion) {
      this.state.offlineRegion.resume();
    }
  }

  onPause() {
    if (this.state.offlineRegion) {
      this.state.offlineRegion.pause();
    }
  }

  async onStatusRequest() {
    if (this.state.offlineRegion) {
      const offlineRegionStatus = await this.state.offlineRegion.status();
      Alert.alert('Get Status', JSON.stringify(offlineRegionStatus, null, 2));
    }
  }

  _formatPercent() {
    if (!this.state.offlineRegionStatus) {
      return '0%';
    }
    return Math.round(this.state.offlineRegionStatus.percentage / 10) / 10;
  }

  _getRegionDownloadState(downloadState) {
    switch (downloadState) {
      case MapboxGL.OfflinePackDownloadState.Active:
        return 'Active';
      case MapboxGL.OfflinePackDownloadState.Complete:
        return 'Complete';
      default:
        return 'Inactive';
    }
  }

  setVisibleofflineOptions(visible) {
    this.setState({
      offlineVisible: visible,
    });
  }

  selectRace(value) {
    this.setState({selected: value});
  }

  pikerItems() {
    let typeItems = this.state.ranchSelect;
    let keys = 0;
    let pickerItems = [];

    pickerItems.push(
      <Picker.Item
        label="Hacienda"
        value="0"
        key={keys}
        iosHeader="Seleccione la hacienda"
      />,
    );

    if (typeItems) {
      typeItems.map(function(items, index) {
        keys++;
        pickerItems.push(
          <Picker.Item label={items.name_es} value={items.id} key={keys} />,
        );
      });
    }

    return (
      <Picker
        selectedValue={this.state.selected}
        onValueChange={value => this.selectRace(value)}
        mode="dropdown"
        iosIcon={<Icon name="arrow-down" />}
        placeholder="Select your SIM"
        placeholderStyle={{color: '#bfc6ea'}}
        placeholderIconColor="#007aff">
        {pickerItems}
      </Picker>
    );
  }

  onUserLocationUpdate(location) {
    Reactotron.log(location);
  }

  selectTypeSignal(e) {
    Reactotron.log(e);
    this.setState({
      typeSignal: e,
    });
  }

  registerSignage() {
    if (this.state.typeSignal) {
      this.setState({
        signalManually: true,
        automaticallySignal: false,
        startSignaling: true,
        isSignaling: true,
        initSignalingIcon: 'ios-pause',
      });
    } else {
      this.setState({
        signalManually: false,
        automaticallySignal: true,
        isSignaling: true,
        initSignalingIcon: 'ios-pause',
        startSignaling: true,
      });
    }
    this.props.setVisibleModal(!this.props.visibleModal);
  }

  getManualPosition() {
    if (this.state.isSignaling) {
      manualSignalingPoints.pop();
      manualSignalingPoints.push(this.state.currentCoords);
      let firstPointsPosition = manualSignalingPoints[0];
      manualSignalingPoints.push(firstPointsPosition);
      Reactotron.log({manualSignalingPoints});
      let features = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [manualSignalingPoints],
        },
      };

      if (
        smileyFaceGeoJSON.features.length > 1 &&
        manualSignalingPoints.length > 2
      ) {
        smileyFaceGeoJSON.features.pop();
      }

      smileyFaceGeoJSON.features.push(features);
      this.setState({
        geoJSON: smileyFaceGeoJSON,
      });
      Reactotron.log(smileyFaceGeoJSON);
    }
  }

  getSignalAction() {
    if (this.state.isSignaling) {
      this.setState({
        isSignaling: false,
        initSignalingIcon: 'ios-play',
      });
    } else {
      this.setState({
        isSignaling: true,
        initSignalingIcon: 'ios-pause',
      });
    }
  }

  setAutomaticSignalPoints(currentCoords) {
    automaticSignalingPoints.pop();
    automaticSignalingPoints.push(currentCoords);
    //let count = automaticSignalingPoints.length;
    let firstPointsPosition = automaticSignalingPoints[0];
    automaticSignalingPoints.push(firstPointsPosition);
    let features = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [automaticSignalingPoints],
      },
    };
    if (
      smileyFaceGeoJSON.features.length > 1 &&
      automaticSignalingPoints.length > 2
    ) {
      smileyFaceGeoJSON.features.pop();
    }

    smileyFaceGeoJSON.features.push(features);
    this.setState({
      geoJSON: smileyFaceGeoJSON,
    });
    Reactotron.log(smileyFaceGeoJSON);
  }

  stopSignaling() {}

  render() {
    const {offlineRegionStatus} = this.state;
    let ranchs = this.pikerItems();

    return (
      <>
        <StatusBar
          backgroundColor={colors.primary.pink}
          barStyle="light-content"
          translucent={false}
        />
        <MapboxGL.MapView
          ref={c => (this._map = c)}
          onPress={this.onPress}
          styleURL={MapboxGL.StyleURL.TrafficNight}
          onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
          onUserLocationUpdate={this.onUserLocationUpdate}
          userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          style={sheet.matchParent}>
          <MapboxGL.UserLocation
            onUpdate={location => {
              const currentCoords = [
                location.coords.longitude,
                location.coords.latitude,
              ];
              if (this.state.automaticallySignal && this.state.isSignaling) {
                this.setAutomaticSignalPoints(currentCoords);
              }

              const initialCoords = this.state.centerLocation;

              this.setState({
                centerLocation: initialCoords ? initialCoords : currentCoords,
                currentCoords,
              });
              Reactotron.log({
                initialCoords,
                currentCoords,
                state: this.state.centerLocation,
              });
            }}
          />

          <MapboxGL.Camera
            zoomLevel={15}
            followUserLocation={true}
            centerCoordinate={this.state.centerLocation}
          />

          <MapboxGL.ShapeSource
            onPress={e => Reactotron.log({hola: 'Hola', e})}
            id="smileyFaceSource"
            shape={this.state.geoJSON}>
            <MapboxGL.FillLayer
              id="smileyFaceFill"
              style={layerStyles.smileyFace}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>

        <Button
          block
          style={{
            backgroundColor: '#6EEDD8',
            position: 'absolute',
            zIndex: 1,
            height: 30,
            width: 150,
            marginTop: 50,
            right: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 3,
            shadowRadius: 2,
          }}
          onPress={() => this.props.setVisibleModal(!this.props.visibleModal)}>
          <Text
            uppercase={false}
            style={{
              fontSize: 13,
            }}>
            Ingresar información
          </Text>
        </Button>

        <Button
          block
          style={{
            backgroundColor: '#6EEDD8',
            position: 'absolute',
            zIndex: 1,
            height: 30,
            width: 150,
            marginTop: 90,
            right: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 3,
            shadowRadius: 2,
          }}
          onPress={() =>
            this.setVisibleofflineOptions(!this.state.offlineVisible)
          }>
          <Text
            uppercase={false}
            style={{
              fontSize: 13,
            }}>
            Modo offline
          </Text>
        </Button>

        {this.state.startSignaling && (
          <>
            <Button
              block
              style={{
                backgroundColor: '#6EEDD8',
                position: 'absolute',
                zIndex: 1,
                height: 40,
                width: 50,
                marginTop: 10,
                left: 3,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 3,
                shadowRadius: 2,
              }}
              onPress={() => this.stopSignaling()}>
              <Icon name="ios-square" />
            </Button>
            <Button
              block
              style={{
                backgroundColor: '#6EEDD8',
                position: 'absolute',
                zIndex: 1,
                height: 40,
                width: 50,
                marginTop: 60,
                left: 3,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 3,
                shadowRadius: 2,
              }}
              onPress={() => this.getSignalAction()}>
              <Icon name={this.state.initSignalingIcon} />
            </Button>
          </>
        )}
        {this.state.signalManually && this.state.isSignaling && (
          <Button
            block
            style={{
              backgroundColor: '#6EEDD8',
              position: 'absolute',
              zIndex: 1,
              height: 60,
              width: 60,
              marginTop: 110,
              left: 3,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 3,
              shadowRadius: 2,
            }}
            onPress={() => this.getManualPosition()}>
            <Icon name="ios-pin" />
          </Button>
        )}

        <IrrigationInfo>
          {ranchs}
          <Item style={styles.items}>
            <Input
              style={{width: width - 20}}
              placeholder="Hectareas"
              value={'' + this.state.hts}
              onChangeText={text => this.setState({hts: text})}
            />
          </Item>
          <Item style={styles.items}>
            <Input
              style={{width: width - 20}}
              placeholder="Nombre suerte"
              value={'' + this.state.suerteName}
              onChangeText={text => this.setState({suerteName: text})}
            />
          </Item>
          <Item style={styles.items}>
            <Input
              style={{width: width - 20}}
              placeholder="Edad"
              value={'' + this.state.suerteAge}
              onChangeText={text => this.setState({suerteAge: text})}
            />
          </Item>
          <Item style={styles.items}>
            <Input
              style={{width: width - 20}}
              placeholder="Variedad"
              value={'' + this.state.variety}
              onChangeText={text => this.setState({variety: text})}
            />
          </Item>
          <Item style={styles.items}>
            <Input
              style={{width: width - 20}}
              placeholder="Observaciones"
              value={'' + this.state.observation}
              onChangeText={text => this.setState({observation: text})}
            />
          </Item>
          <Item style={styles.items}>
            <Text>Realizar señalización manual </Text>
            <Switch
              onValueChange={value => this.selectTypeSignal(value)}
              value={this.state.typeSignal}
            />
          </Item>
          <Item
            style={[
              styles.items,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Button
              block
              style={{
                backgroundColor: '#6EEDD8',
                width: wp('90%'),
                marginTop: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 3,
                shadowRadius: 2,
              }}
              onPress={() => this.registerSignage()}>
              <Text
                uppercase={false}
                style={{
                  fontSize: 13,
                }}>
                Registrar
              </Text>
            </Button>
          </Item>
        </IrrigationInfo>

        {offlineRegionStatus !== null && this.state.offlineVisible ? (
          <Bubble>
            <View style={{flex: 1}}>
              <Text>
                Download State:{' '}
                {this._getRegionDownloadState(offlineRegionStatus.state)}
              </Text>
              <Text>Download Percent: {offlineRegionStatus.percentage}</Text>
              <Text>
                Completed Resource Count:{' '}
                {offlineRegionStatus.completedResourceCount}
              </Text>
              <Text>
                Completed Resource Size:{' '}
                {offlineRegionStatus.completedResourceSize}
              </Text>
              <Text>
                Completed Tile Count: {offlineRegionStatus.completedTileCount}
              </Text>
              <Text>
                Required Resource Count:{' '}
                {offlineRegionStatus.requiredResourceCount}
              </Text>

              <View style={styles.buttonCnt}>
                <TouchableOpacity onPress={this.onResume}>
                  <View style={styles.button}>
                    <Text style={styles.buttonTxt}>Resume</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onStatusRequest}>
                  <View style={styles.button}>
                    <Text style={styles.buttonTxt}>Status</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onPause}>
                  <View style={styles.button}>
                    <Text style={styles.buttonTxt}>Pause</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Bubble>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    visibleModal: state.iddesagroState.visibleModal,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setVisibleModal: visible => dispatch(setVisibleModal(visible)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignalPlots);
