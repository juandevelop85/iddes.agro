import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const styles = {};

styles.percentageText = {
  padding: 8,
  textAlign: 'center',
};

styles.buttonCnt = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

styles.button = {
  flex: 0.4,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 3,
  backgroundColor: 'blue',
  padding: 8,
};

styles.buttonTxt = {
  color: 'white',
};

styles.items = {
  backgroundColor: '#FFFFFF',
  width: wp('90%'),
  height: hp('6%'),
  borderRadius: 8,
};

styles.actionCircle = {
  width: 60,
  height: 60,
  borderRadius: 60 / 2,
  backgroundColor: '#9CC9DC',
  alignContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  justifyContent: 'center',
  margin: 10,
  padding: 10,
};

export default StyleSheet.create(styles);
