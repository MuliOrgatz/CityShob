import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { AuthService } from '../../services/auth.service';
import {
  catchError,
  map,
  mergeMap,
  tap,
  of,
  withLatestFrom,
  switchMap,
} from 'rxjs';
import { Router } from '@angular/router';
import { selectCurrentUser } from './user.selectors';
import { Store } from '@ngrx/store';
import { SocketService } from '../../services/socket.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);
  private socket = inject(SocketService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          tap(({ accessToken, refreshToken, user }) => {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
          }),
          map(({ user }) => UserActions.loginSuccess({ user })),
          catchError((err) =>
            of(
              UserActions.loginFailure({
                error: err.error?.message || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loginSuccess),
        tap((user) => {
          this.router.navigateByUrl('/');
          this.socket.emitEvent('identify', user.user.username);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loginFailure),
        tap(() => alert('Login failed'))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.logout),
        withLatestFrom(this.store.select(selectCurrentUser)),
        tap(([_, user]) => {
          if (user?._id) {
            this.authService.logout(user._id);
          }
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigateByUrl('/login');
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.register),
      mergeMap(({ username, password }) =>
        this.authService.register(username, password).pipe(
          tap(() => alert('User created successfully')),
          switchMap(() => [UserActions.login({ username, password })]),
          catchError((err) =>
            of(
              UserActions.loginFailure({
                error: err.error?.message || 'Registration failed',
              })
            )
          )
        )
      )
    )
  );

  loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserFromStorage),
      mergeMap(() => {
        const accessToken = localStorage.getItem('access_token');
        const userString = localStorage.getItem('user');

        if (accessToken && userString) {
          const user = JSON.parse(userString);
          return of(UserActions.loginSuccess({ user }));
        }

        return of(UserActions.logout());
      })
    )
  );
}
