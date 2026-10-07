import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (!authService.isTokenValid()){
    authService.logoutUser();
    return false;
  } else {
    return true;
  }
};
