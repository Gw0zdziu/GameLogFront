import {Routes} from '@angular/router';
import {CategoryComponent} from '../../category/category.component';
import {GameComponent} from '../../game/game.component';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {authGuard} from '../../../core/guards/auth/auth.guard';

export const homeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'categories',
    component: CategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'games',
    component: GameComponent,
    canActivate: [authGuard],
  }
];
