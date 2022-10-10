import { legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import loginReducer from '../reducers/loginReducer';

const store = createStore(loginReducer, composeWithDevTools());

if (window.Cypress) {
  window.store = store;
}

export default store;
