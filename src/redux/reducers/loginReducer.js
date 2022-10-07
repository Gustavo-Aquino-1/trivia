import { TYPE_LOGIN } from '../actions/actionsTypes';

const INITIAL_STATE = {
  email: '',
  name: '',
};

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case TYPE_LOGIN:
    return {
      ...action.payload,
    };
  default:
    return state;
  }
};

export default loginReducer;
