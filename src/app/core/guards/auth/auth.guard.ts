import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';

export const authGuard: CanActivateFn = () => {
  const loggedUserStore = inject(LoggedStoreService);
  const router = inject(Router);
  if (loggedUserStore.isLogged$()){
    return true;
  } else {
    router.navigate(['./login']);
    return false;
  }


};
