import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {Icon} from 'native-base';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {setVisibleModal} from '../../actions';

class IrrigationInfo extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    children: PropTypes.any,
    style: PropTypes.any,
  };
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      transparent: true,
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    let innerChildView = this.props.children;

    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff', padding: 20}
      : null;
    var activeButtonStyle = {
      backgroundColor: '#ddd',
    };

    return (
      <Modal
        style={{borderRadius: 15}}
        animationType={this.state.animationType}
        transparent={this.state.transparent}
        visible={this.props.visibleModal}
        onBackdropPress={() => this.setModalVisible(false)}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <KeyboardAvoidingView
          style={[styles.containerModal, modalBackgroundStyle]}
          behavior="position"
          enabled>
          <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
            <Icon
              name="ios-close-circle"
              onPress={() =>
                this.props.setVisibleModal(!this.props.visibleModal)
              }
              style={{
                color: '#FF4B1E',
                alignSelf: 'flex-end',
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 2,
                margin: 3,
              }}
            />
            {innerChildView}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#0E79B2',
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#041952',
    fontFamily: 'Comfortaa-Bold',
    textAlign: 'center',
    fontSize: wp('3'),
  },
  itemTextRi: {
    color: '#041952',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  itemTextIz: {
    color: '#041952',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  containerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#0B58AA',
    margin: 0,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    margin: 3,
    //padding: 20,
  },
  textModal: {
    fontSize: 15,
    paddingLeft: 10,
    fontFamily: 'Comfortaa-Regular',
    color: '#000000',
  },
  titleCharacteristics: {
    fontSize: 15,
    paddingLeft: 10,
    fontFamily: 'Comfortaa-Regular',
    color: '#000000',
    marginTop: 10,
  },
  textCharacteristics: {
    paddingTop: 10,
    fontSize: 10,
    paddingLeft: 10,
    fontFamily: 'Comfortaa-Regular',
    color: '#000000',
    textAlign: 'justify',
  },
  innerContainer: {
    borderRadius: 15,
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(IrrigationInfo);
