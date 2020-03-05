import {
  LOAD_SUCCESS,
  ACTUALIZAR_PERFIL,
  LOAD_LOCATION,
  REGISTRAR_FORMULARIO,
  RESET_FORMULARIO,
  VISIBLE_MODAL,
  COUNT_CART,
  RESET_STATE,
  STATE_DEVICE,
  SOCKET_CLIENT,
  BUY_MODAL_VISIBLE,
  BUY_MODAL_DATA,
  DIRECTIONS_MODAL_VISIBLE,
  DIRECTIONS_MODAL_DATA,
  BUY_DIRECTION,
} from '../actions';

const initialState = {
  fetchData: [],
  userLocation: [],
  dataStore: [],
  visibleModal: false,
  dataProfile: [],
  numberItemCart: 0,
  stateDevice: {
    idDevice: 'asdlk123lk',
    temp: '-',
    foodOnPlate: '-',
    waterOnPlate: '-',
    foodInTolva: '-',
    waterInTolva: '-',
    create_at: '-',
  },
  socketIoClient: null,
  modalVisible: false,
  modalData: [],
  directionsModalVisible: true,
  directionsModalData: [],
  selectedDirection: '',
};

function alicanState(state = initialState, action) {
  switch (action.type) {
    case LOAD_SUCCESS:
      return {
        ...state,
        fetchData: action.response,
      };
    case LOAD_LOCATION:
      return {
        ...state,
        userLocation: action.location,
      };
    case REGISTRAR_FORMULARIO:
      let item = action.data;
      return {
        ...state,
        dataStore: {
          ...this.dataStore,
          items: item,
        },
      };
    case RESET_FORMULARIO:
      let resetitem = action.data;
      return {
        ...state,
        dataStore: resetitem,
      };
    case VISIBLE_MODAL:
      return {...state, visibleModal: action.visible};
    case ACTUALIZAR_PERFIL:
      return {
        ...state,
        dataProfile: action.data,
      };
    case RESET_STATE:
      return {
        ...state,
        ...initialState,
      };
    case COUNT_CART:
      return {
        ...state,
        numberItemCart: action.num,
      };
    case STATE_DEVICE:
      return {
        ...state,
        stateDevice: action.data,
      };
    case SOCKET_CLIENT:
      return {
        ...state,
        socketIoClient: action.data,
      };
    case BUY_MODAL_VISIBLE:
      return {
        ...state,
        modalVisible: action.visible,
      };
    case BUY_MODAL_DATA:
      return {
        ...state,
        modalData: action.data,
      };
    case DIRECTIONS_MODAL_VISIBLE:
      return {
        ...state,
        directionsModalVisible: action.visible,
      };
    case DIRECTIONS_MODAL_DATA:
      return {
        ...state,
        directionsModalData: action.data,
      };
    case BUY_DIRECTION:
      return {
        ...state,
        selectedDirection: action.data,
      };
    default:
      return state;
  }
}

export default alicanState;
