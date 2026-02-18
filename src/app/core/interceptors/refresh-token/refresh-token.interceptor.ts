import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {RefreshTokenService} from '../../services/refresh-token/refresh-token.service';
import {catchError, EMPTY, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../../features/auth/services/auth.service';
import {TokenStoreService} from '../../store/token-store/token-store.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStoreService = inject(TokenStoreService);
  const refreshTokenService = inject(RefreshTokenService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const isRefreshing = false;
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('refresh-token')) {
        if (!isRefreshing) {
            return refreshTokenService.refreshToken().pipe(
              switchMap(token => {
                tokenStoreService.updateToken(token);
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                })
                return next(req);
              }),
              catchError((error: HttpErrorResponse) => {
                if(error.status === 400){
                  router.navigate(['login']);
                  authService.logoutUser().subscribe();
                }
                return EMPTY;
              })
            )
        }
      }
      return throwError(() => err)
    })
  )
};


