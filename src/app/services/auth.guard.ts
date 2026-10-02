import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { Auth } from './auth';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.isAuthenticated().pipe(
    map((isAuthenticated) => isAuthenticated
      ? true
      : router.createUrlTree(['/'], {
          queryParams: { returnUrl: state.url },
        })),
  );
};