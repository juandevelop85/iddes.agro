import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import AppReducer from './src/reducers';

export default function configureStore() {
  const store = createStore(AppReducer, applyMiddleware(thunk));
  return store;
}
