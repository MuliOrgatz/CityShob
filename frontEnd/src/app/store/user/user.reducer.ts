import { createReducer, on } from '@ngrx/store';
import { UserState } from './user.models';
import { loginSuccess, logout } from './user.actions';

const initialState: UserState = {
  user: null,
};

export const userReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { user }) => ({ ...state, user })),
  on(logout, () => ({ user: null }))
);
