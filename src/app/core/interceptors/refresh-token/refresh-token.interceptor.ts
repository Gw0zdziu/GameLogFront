import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {UserStoreService} from '../../store/user-store/user-store.service';
import {inject} from '@angular/core';
import {RefreshTokenService} from '../../services/refresh-token/refresh-token.service';
import {catchError, switchMap} from 'rxjs';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userStoreService = inject(UserStoreService);
  const refreshTokenService = inject(RefreshTokenService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse, caught) => {
      if (err.status === 401) {
      return refreshTokenService.refreshToken().pipe(
        switchMap(x => {
            userStoreService.updateUser({token: x});
            return next(req);
        })
      )} else {
        return next(req);
      }
    })
  )
};
