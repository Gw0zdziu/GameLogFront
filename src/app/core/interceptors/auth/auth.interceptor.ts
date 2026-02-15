import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {IS_AUTH_REQUIRED} from "../../tokens/tokens";
import {TokenStoreService} from '../../store/token-store/token-store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userStoreService = inject(TokenStoreService);
  if(req.context.get(IS_AUTH_REQUIRED)){
    if (userStoreService.token$()) {
      const request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${userStoreService.token$()}`
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
