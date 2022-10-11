import { TYPE_LOGIN, TYPE_ATT_SCORE, TYPE_CLEAN_SCORE } from '../actions/actionsTypes';

const INITIAL_STATE = {
  player: {
    name: '',
    assertions: 0,
    score: 0,
    gravatarEmail: '',
  },
};

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case TYPE_LOGIN:
    return {
      ...state,
      player: {
        ...state.player,
        name: action.payload.name,
        gravatarEmail: action.payload.email,
      },
    };
  case TYPE_ATT_SCORE:
    return {
      ...state,
      player: {
        ...state.player,
        score: state.player.score + action.payload,
        assertions: state.player.assertions + 1,
      },
    };
  case TYPE_CLEAN_SCORE:
    return {
      player: {
        name: '',
        assertions: 0,
        score: 0,
        gravatarEmail: '',
      },
    };
  default:
    return state;
  }
};

export default loginReducer;
