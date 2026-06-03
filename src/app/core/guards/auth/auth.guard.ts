import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../../features/auth/services/auth.service';
import {catchError, map, of} from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.verify().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['login'])))
  );
};
