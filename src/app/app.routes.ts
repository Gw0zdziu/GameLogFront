import {Routes} from '@angular/router';
import {HomeComponent} from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () => import('./features/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./features/components/registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'confirm-account',
    loadComponent: () => import('./features/components/confirm-account/confirm-account.component').then(m => m.ConfirmAccountComponent)
  }
];
