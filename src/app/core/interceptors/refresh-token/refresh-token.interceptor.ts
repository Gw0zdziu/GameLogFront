import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {UserStoreService} from '../../store/user-store/user-store.service';
import {inject} from '@angular/core';
import {RefreshTokenService} from '../../services/refresh-token/refresh-token.service';
import {catchError, map, of} from 'rxjs';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userStoreService = inject(UserStoreService);
  const refreshTokenService = inject(RefreshTokenService);
  const loggedStoreService = inject(LoggedStoreService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && loggedStoreService.isLogged$()) {
      return refreshTokenService.refreshToken().pipe(
        map(x => {
          userStoreService.updateUser({token: x});
          loggedStoreService.setLogged(true);
          return next(req)
        }),
        catchError((err) => {
          userStoreService.cleanStore();
          loggedStoreService.setLogged(false);
          return of(err)
        })
      )} else {
        return next(req);
      }
    })
  )
};
