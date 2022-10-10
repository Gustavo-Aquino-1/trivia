import { TYPE_LOGIN, TYPE_ATT_SCORE } from './actionsTypes';

export const loginAction = (data) => ({ type: TYPE_LOGIN, payload: data });
export const attScoreAction = (score) => ({
  type: TYPE_ATT_SCORE,
  payload: score,
});
