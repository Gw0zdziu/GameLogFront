import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {UserStoreService} from '../../store/user-store/user-store.service';
import {IS_AUTH_REQUIRED} from "../../tokens/tokens";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userStoreService = inject(UserStoreService);
  if(req.context.get(IS_AUTH_REQUIRED)){
    if (userStoreService.user$()?.token) {
      const request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${userStoreService.user$()?.token}`
        }
      });
      return next(request);
    } else {
      return next(req);
    }
  } else {
    return next(req);
  }

};
