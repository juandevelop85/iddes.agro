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
    fillOutlineColor: 'rgba(255, 255, 255, 0.84)',
  },
};

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
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: 'blue',
    padding: 8,
  },
  buttonTxt: {
    color: 'white',
  },
  items: {
    backgroundColor: '#FFFFFF',
    width: wp('90%'),
    height: hp('6%'),
    borderRadius: 8,
  },
});

class ViewIrrigationInfo extends React.Component {
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
    };

    this.onDownloadProgress = this.onDownloadProgress.bind(this);
    this.onDidFinishLoadingStyle = this.onDidFinishLoadingStyle.bind(this);

    this.onResume = this.onResume.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onStatusRequest = this.onStatusRequest.bind(this);
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
          onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
          style={sheet.matchParent}>
          <MapboxGL.Camera zoomLevel={15} centerCoordinate={CENTER_COORD} />

          <MapboxGL.ShapeSource id="smileyFaceSource" shape={smileyFaceGeoJSON}>
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
              onPress={() =>
                this.props.setVisibleModal(!this.props.visibleModal)
              }>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewIrrigationInfo);
