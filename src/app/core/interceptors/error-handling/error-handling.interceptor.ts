import {HttpInterceptorFn} from '@angular/common/http';
import {catchError, of} from 'rxjs';
import {inject} from '@angular/core';
import {ToastService} from '../../../shared/services/toast/toast.service';
import {errorMessages} from "../../constants/error-messages";

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError(x => {
        console.log(x)
        if (errorMessages.has(x.error.code)){
            toastService.showError(errorMessages.get(x.error.code) as string)
        }
        return of();
    })
  )
};
