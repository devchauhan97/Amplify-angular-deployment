import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { BACKEND_API_URL } from '../config/api.config';

type AuthResponse = {
  access_token?: string;
};

@Injectable({
  providedIn: 'root',
})
export class Auth {
    private http = inject(HttpClient);

    isAuthenticated(): Observable<boolean> {
      return this.http.get(`${BACKEND_API_URL}/users`, {
        withCredentials: true,
      }).pipe(
        map(() => true),
        catchError(() => of(false)),
      );
    }

    health(): Observable<AuthResponse> {
      return this.http.get<AuthResponse>(
        `${BACKEND_API_URL}/health`
      );
    }

    login(username: string, password: string): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(
        `${BACKEND_API_URL}/auth/login`,
        { username, password },
       // { withCredentials: true },
      );
    }

    refreshToken(): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(
        `${BACKEND_API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true },
      );
    }
}
