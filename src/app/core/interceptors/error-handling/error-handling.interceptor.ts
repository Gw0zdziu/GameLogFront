import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {ToastService} from '../../../shared/services/toast/toast.service';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/auth/refresh-token', '/api/auth/verify', '/api/auth/logout'];
  const includedErrorCodes = [400,401,404,409,428,429]
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isExcluded = excludedUrls.some(url => err.url?.includes(url));
      if (!isExcluded) {
        console.log(err.error.code)
        if (includedErrorCodes.some(x => err.status === x)) {
        toastService.showError(err.error.code);
        return throwError(() => err);
        }
      }
      return throwError(() => err);
    })
  )
};
