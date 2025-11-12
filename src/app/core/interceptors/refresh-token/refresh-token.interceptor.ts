import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {UserStoreService} from '../../store/user-store/user-store.service';
import {inject} from '@angular/core';
import {RefreshTokenService} from '../../services/refresh-token/refresh-token.service';
import {catchError, switchMap, throwError} from 'rxjs';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userStoreService = inject(UserStoreService);
  const refreshTokenService = inject(RefreshTokenService);
  const loggedStoreService = inject(LoggedStoreService);
  let isRefreshing = false;
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        if (!isRefreshing) {
          if (loggedStoreService.isLogged$()) {
            return refreshTokenService.refreshToken().pipe(
              switchMap(token => {
                userStoreService.updateUser({token});
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                })
                return next(req);
              }),
              catchError(err => {
                return throwError(() => err)
              })
            )
          }
        }
      }
      return throwError(() => err)
    })
  )
};


