import Api from '../lib/Api';
import AsyncStorage from '@react-native-community/async-storage';
import {DATA_PRODUCT_STORE} from '../lib/Constants';

export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const LOAD_LOCATION = 'LOAD_LOCATION';
export const REGISTRAR_FORMULARIO = 'REGISTRAR_FORMULARIO';
export const RESET_FORMULARIO = 'RESET_FORMULARIO';
export const VISIBLE_MODAL = 'CLOSE_MODAL';
export const ACTUALIZAR_PERFIL = 'ACTUALIZAR_PERFIL';
export const COUNT_CART = 'COUNT_CART';
export const RESET_STATE = 'RESET_STATE';
export const STATE_DEVICE = 'STATE_DEVICE';
export const SOCKET_CLIENT = 'SOCKET_CLIENT';
export const BUY_MODAL_VISIBLE = 'BUY_MODAL_VISIBLE';
export const BUY_MODAL_DATA = 'BUY_MODAL_DATA';
export const DIRECTIONS_MODAL_VISIBLE = 'DIRECTIONS_MODAL_VISIBLE';
export const DIRECTIONS_MODAL_DATA = 'DIRECTIONS_MODAL_DATA';
export const BUY_DIRECTION = 'BUY_DIRECTION';
import Reactotron from 'reactotron-react-native';

let numberItemCart = 0;

export function setCountCart(num) {
  return {
    type: COUNT_CART,
    num,
  };
}

export function addCountCart(num) {
  return {
    type: COUNT_CART,
    num: numberItemCart++,
  };
}

export function subtractCountCart(num) {
  return {
    type: COUNT_CART,
    num: numberItemCart > 0 ? numberItemCart-- : 0,
  };
}

export function loadLocation(location) {
  return {
    type: LOAD_LOCATION,
    location,
  };
}

export function registrarFormulario(data) {
  return {
    type: REGISTRAR_FORMULARIO,
    data,
  };
}

export function resetFormulario(data) {
  return {
    type: RESET_FORMULARIO,
    data,
  };
}

export function stateDevice(data) {
  return {
    type: STATE_DEVICE,
    data,
  };
}

export function visibleModal(visible) {
  return {type: VISIBLE_MODAL, visible};
}

export function actualizarPerfil(data) {
  return {
    type: ACTUALIZAR_PERFIL,
    data,
  };
}

export function socketIoClientRedux(data) {
  return {
    type: SOCKET_CLIENT,
    data,
  };
}

export function loadSuccess(response) {
  return {type: LOAD_SUCCESS, response};
}

export function setVisibleBuyModal(visible) {
  return {type: BUY_MODAL_VISIBLE, visible};
}

export function setDataBuyModal(data) {
  return {type: BUY_MODAL_DATA, data};
}

export function setVisibleDirectionsModal(visible) {
  return {type: DIRECTIONS_MODAL_VISIBLE, visible};
}

export function setDataDirectionsModal(data) {
  return {type: DIRECTIONS_MODAL_DATA, data};
}

export function setSelectedDirections(data) {
  return {type: BUY_DIRECTION, data};
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

export function restartState() {
  return {type: RESET_STATE};
}

export function registerProductInCart(item) {
  return async function(dispatch) {
    await AsyncStorage.getItem(DATA_PRODUCT_STORE).then(async items => {
      try {
        item.quantity = 1;
        item.originalPrice = item.price;
        let arrItems = [];
        //let pushItemsArray = [];
        let productAlreadySelected = false;

        if (items) {
          if (items.length > 1) {
            arrItems = JSON.parse(items);
            arrItems.map((i, id) => {
              if (i.product.key == item.product.key) {
                productAlreadySelected = true;
              }
            });

            //Si el producto no ha sido seleccionado lo registramos en el arreglo
            if (productAlreadySelected) {
              alert('Producto ya registrado');
            } else {
              arrItems.push(item);
            }
          } else {
            arrItems.push(item);
          }
        } else {
          arrItems.push(item);
        }

        await AsyncStorage.setItem(
          DATA_PRODUCT_STORE,
          JSON.stringify(arrItems),
        );
        dispatch(setCountCart(arrItems.length));
      } catch (error) {
        Reactotron.log({errorcito: error});
      }
    });
  };
}
