import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../../features/auth/services/auth.service';
import {TokenStoreService} from '../../store/token-store/token-store.service';
import {ToastService} from '../../../shared/services/toast/toast.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/auth/login', '/api/auth/refresh-token'];
  const tokenStoreService = inject(TokenStoreService);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isExcluded = excludedUrls.some(url => req.url.includes(url));
      if (err.status === 401 && !isExcluded) {
            return authService.refreshToken().pipe(
              catchError(x => {
                authService.logoutUser().subscribe();
                router.navigate(['login']);
                toastService.showInfo('auth.token-expired');
                return throwError(() => x);
              }),
              switchMap(token => {
                tokenStoreService.setToken(token);
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                })
                return next(req);
                }),
            )
      }
      return throwError(() => err)
    })
  )
};


