import AsyncStorage from '@react-native-community/async-storage';

/**
 * @description
 * @author Juan Sebastian Vernaza
 * @date 2019-10-04
 * @export
 * @param {*} key
 * @param {*} item
 * @returns
 */
export async function setVarcharItem(key, item) {
  try {
    await AsyncStorage.setItem(key, item);
    return true;
  } catch (error) {
    //console.log(error);
    return false;
  }
}

/**
 * @description
 * @author Juan Sebastian Vernaza
 * @date 2019-10-04
 * @export
 * @param {*} key
 * @param {*} item
 * @returns
 */
export async function setObjectItem(key, item) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    //console.log(error);
    return false;
  }
}

/**
 * @description
 * @author Juan Sebastian Vernaza
 * @date 2019-10-04
 * @export
 * @param {*} key
 * @returns
 */
export async function getVarcharItem(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    return false;
  }
}

/**
 * @description
 * @author Juan Sebastian Vernaza
 * @date 2019-10-04
 * @export
 * @param {*} key
 * @returns
 */
export async function getObjectItem(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value);
  } catch (error) {
    return false;
  }
}
