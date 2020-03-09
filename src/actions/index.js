import Api from '../lib/Api';
import AsyncStorage from '@react-native-community/async-storage';
import {DATA_PRODUCT_STORE} from '../lib/Constants';

export const VISIBLE_MODAL = 'CLOSE_MODAL';
export const LOAD_SUCCESS = 'LOAD_SUCCESS';

import Reactotron from 'reactotron-react-native';

let numberItemCart = 0;

export function setVisibleModal(visible) {
  return {type: VISIBLE_MODAL, visible};
}

export function fetchPost(url, params, token) {
  return function(dispatch) {
    return Api.post(url, params, token)
      .then(response => {
        if (response.statusCode === 401) {
          dispatch(
            loadSuccess({
              response: {
                message:
                  'Tu sesion ha finalizado, cierra sesion y vuelve a iniciar',
              },
              error: true,
            }),
          );
        } else if (response.statusCode === 500) {
          dispatch(
            loadSuccess({
              response: {
                message: 'Error en el servicio por favor intenta mas tarde',
              },
              error: true,
            }),
          );
        } else {
          dispatch(loadSuccess(response));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export function fetchGet(url, token) {
  return function(dispatch) {
    return Api.get(url, token)
      .then(response => {
        dispatch(loadSuccess(response));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function loadSuccess(response) {
  return {type: LOAD_SUCCESS, response};
}

export function restartState() {
  return {type: RESET_STATE};
}
