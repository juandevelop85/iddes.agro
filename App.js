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
import geoViewport from '@mapbox/geo-viewport';

import sheet from './src/styles/sheet';
import gridPattern from './assets/grid_pattern.png';
import smileyFaceGeoJSON from './assets/smiley_face.json';

import BaseExamplePropTypes from './src/common/BaseExamplePropTypes';
import Page from './src/common/Page';
import Bubble from './src/common/Bubble';

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
});

class CreateOfflineRegion extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      name: `test-${Date.now()}`,
      offlineRegion: null,
      offlineRegionStatus: null,
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

  render() {
    const {offlineRegionStatus} = this.state;

    return (
      <Page {...this.props}>
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

        {offlineRegionStatus !== null ? (
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
      </Page>
    );
  }
}

export default CreateOfflineRegion;
