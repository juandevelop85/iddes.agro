import {VISIBLE_MODAL, LOAD_SUCCESS} from '../actions';

const initialState = {
  fetchData: [],
  userLocation: [],
  dataStore: [],
  visibleModal: false,
};

function iddesagroState(state = initialState, action) {
  switch (action.type) {
    case LOAD_SUCCESS:
      return {
        ...state,
        fetchData: action.response,
      };
    case VISIBLE_MODAL:
      return {
        ...state,
        visibleModal: action.visible,
      };
    default:
      return state;
  }
}

export default iddesagroState;
