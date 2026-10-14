import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {ToastService} from '../../../shared/services/toast/toast.service';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/auth/login', '/api/auth/refresh-token', '/api/auth/verify'];
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isExcluded = excludedUrls.some(url => err.url?.includes(url));
      if (!isExcluded) {
        if (err.status === 401) {}
        toastService.showError(err.error.code);
        return throwError(() => err);
      }
      return throwError(() => err);
    })
  )
};
