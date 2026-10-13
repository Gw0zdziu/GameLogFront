import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';

export const authGuard: CanActivateFn = () => {
  const loggedStoreService = inject(LoggedStoreService);
  const router = inject(Router);
  if (loggedStoreService.isLogged$()){
    return true
  } else {
    router.createUrlTree(['login'])
    return false;
  }
};
