import {HttpInterceptorFn} from '@angular/common/http';
import {inject, LOCALE_ID} from '@angular/core';

export const acceptLanguageInterceptor: HttpInterceptorFn = (req, next) => {
  const currentLanguage = inject(LOCALE_ID);
  const requestWithAcceptLanguage = req.clone({
    setHeaders: {
      'Accept-Language': currentLanguage
    }
  })
  return next(requestWithAcceptLanguage);
};
