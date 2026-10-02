import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';

import { Auth } from './auth';
import { BACKEND_API_URL } from '../config/api.config';

const apiUrl = `${BACKEND_API_URL}/`;
let refreshRequest: Observable<unknown> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(Auth);
  const credentialedRequest = request.url.startsWith(apiUrl)
    ? request.clone({ withCredentials: true })
    : request;

  return next(credentialedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefreshRequest = request.url === `${apiUrl}auth/refresh-token`;
      const isLoginRequest = request.url === `${apiUrl}auth/login`;

      if (error.status !== 401 || isRefreshRequest || isLoginRequest) {
        return throwError(() => error);
      }

      refreshRequest ??= auth.refreshToken().pipe(
        finalize(() => refreshRequest = null),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

      return refreshRequest.pipe(
        switchMap(() => next(credentialedRequest)),
        catchError((refreshError) => throwError(() => refreshError)),
      );
    }),
  );
};