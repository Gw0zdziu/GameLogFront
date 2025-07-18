import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {UserStoreService} from '../services/store/user-store/user-store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userStoreService = inject(UserStoreService);
  const request = req.clone({
    setHeaders: {
      Authorization: `Bearer ${userStoreService.currentUser()?.token}`
    }
  });
  return next(request);
};
