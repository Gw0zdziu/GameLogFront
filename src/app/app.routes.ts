import {Routes} from '@angular/router';
import {authGuard} from "./core/guards/auth/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent),
    loadChildren: () => import('./features/home/routes/home.routes')
      .then(m => m.homeRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component')
      .then(m => m.LoginComponent),
  },
  {
    path: 'registration',
    loadComponent: () => import('./features/user/components/registration/registration.component')
      .then(m => m.RegistrationComponent),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
