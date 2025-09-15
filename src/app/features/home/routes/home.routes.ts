import {Routes} from '@angular/router';
import {CategoryComponent} from '../../category/category.component';
import {GameComponent} from '../../game/game.component';
import {DashboardComponent} from '../../dashboard/dashboard.component';

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
  },
  {
    path: 'games',
    component: GameComponent,
  }
];
