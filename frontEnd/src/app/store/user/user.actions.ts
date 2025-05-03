import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[User] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[User] Login Success',
  props<{ user: { _id: string; username: string } }>()
);

export const loginFailure = createAction(
  '[User] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[User] Register',
  props<{ username: string; password: string }>()
);

export const logout = createAction('[User] Logout');

export const loadUserFromStorage = createAction(
  '[User] Load User From Storage'
);
