import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const loggedUserStore = inject(LoggedStoreService);
  const router = inject(Router);
  console.log(loggedUserStore.isLogged$());
  if (loggedUserStore.isLogged$()){
    return false;
  } else {
    return router.createUrlTree(['home']);
  }
};
