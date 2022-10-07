import { TYPE_LOGIN } from './actionsTypes';

export const loginAction = (data) => ({ type: TYPE_LOGIN, payload: data });
export const loadingAction = () => ({});
