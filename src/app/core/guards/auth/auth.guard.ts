import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';

export const authGuard: CanActivateFn = () => {
  const loggedUserStore = inject(LoggedStoreService);
  if (loggedUserStore.isLogged$()){
    return true;
  } else {
    return false;
  }


};
