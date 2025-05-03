import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { ApiUrls } from '../shared/constants/api-urls.const';
import { LoginResponse, RefreshTokenResponse } from '../models/user.model';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${ApiUrls.users}/login`, {
      username,
      password,
    });
  }

  logout(userId?: string) {
    if (userId) {
      this.http.post(`${ApiUrls.users}/logout`, { userId }).subscribe();
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  refreshAccessToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return of(null);

    return this.http
      .post<RefreshTokenResponse>(`${ApiUrls.users}/refresh-token`, {
        token: refreshToken,
      })
      .pipe(
        tap(({ accessToken }) =>
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
        ),
        map(({ accessToken }) => accessToken),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  register(username: string, password: string) {
    return this.http.post(`${ApiUrls.users}/create-user`, {
      username,
      password,
    });
  }
}
