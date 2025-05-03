import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.models';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state?.user ?? null
);

export const isAuthenticated = createSelector(
  selectCurrentUser,
  (user) => !!user
);
