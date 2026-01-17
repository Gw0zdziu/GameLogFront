import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {LoggedStoreService} from './core/store/logged-store/logged-store.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: (): string =>  {
      const isLogged = inject(LoggedStoreService).isLogged$;
      return isLogged() ? 'home' : 'login';
    },
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    loadChildren: () => import('./features/home/routes/home.routes').then(m => m.homeRoutes),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./features/user/components/registration/registration.component')
      .then(m => m.RegistrationComponent)
  },
  {
    path: 'confirm-account/:userId',
    loadComponent: () => import('./features/user/components/confirm-account/confirm-account.component')
      .then(m => m.ConfirmAccountComponent)
  },
  {
    path: 'recovery-password',
    loadComponent: () => import('./features/auth/components/recovery-password/recovery-password.component')
      .then(m => m.RecoveryPasswordComponent)
  },
  {
    path: 'recovery-update-password',
    loadComponent: () => import('./features/auth/components/recovery-update-password/recovery-update-password.component')
      .then(m => m.RecoveryUpdatePasswordComponent)
  },
  {
    path: 'submit-recovery-password',
    loadComponent: () => import('./features/auth/components/submit-recovery-password/submit-recovery-password.component')
      .then(m => m.SubmitRecoveryPasswordComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
