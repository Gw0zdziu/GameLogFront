import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {UserStoreService} from '../../store/user-store/user-store.service';
import {inject} from '@angular/core';
import {RefreshTokenService} from '../../services/refresh-token/refresh-token.service';
import {catchError, EMPTY, switchMap, throwError} from 'rxjs';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../features/auth/services/auth.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userStoreService = inject(UserStoreService);
  const refreshTokenService = inject(RefreshTokenService);
  const loggedStoreService = inject(LoggedStoreService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const isRefreshing = false;
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('refresh-token')) {
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
              catchError((error: HttpErrorResponse) => {
                if(error.status === 400){
                  router.navigate(['./login']);
                  userStoreService.cleanStore();
                  loggedStoreService.setLogged(false);
                  authService.logoutUser().subscribe();
                }
                return EMPTY;
              })
            )
          }
        }
      }
      return throwError(() => err)
    })
  )
};


