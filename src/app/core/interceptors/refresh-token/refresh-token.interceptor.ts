import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {RefreshTokenService} from '../../services/refresh-token/refresh-token.service';
import {catchError, EMPTY, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../../features/auth/services/auth.service';
import {TokenStoreService} from '../../store/token-store/token-store.service';
import {ToastService} from '../../../shared/services/toast/toast.service';
import {infoMessages} from '../../constants/info-messages';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/auth/login', '/api/auth/refresh-token'];
  const tokenStoreService = inject(TokenStoreService);
  const refreshTokenService = inject(RefreshTokenService);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.log(err)
      const isExcluded = excludedUrls.some(url => req.url.includes(url));
      if (err.status === 401 && !isExcluded) {
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
                router.navigate(['login']);
                authService.logoutUser().subscribe();
                if (infoMessages.has('auth.token.expired')){
                  const message = infoMessages.get('auth.token.expired') as string;
                  toastService.showInfo(message);
                }
                return EMPTY;
              })
            )
      } else {
        router.navigate(['login']).finally();
        authService.logoutUser().subscribe();
        if (infoMessages.has('auth.token.expired')){
          const message = infoMessages.get('auth.token.expired') as string;
          toastService.showInfo(message);
        }
      }
      return throwError(() => err)
    })
  )
};


