import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {LayoutService} from '../../shared/services/layout/layout.service';
import MenuComponent from '../../core/components/menu/menu.component';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [
    MenuComponent,
    RouterOutlet,
    NavbarComponent,
    MenuComponent,
  ],
  template: `
    <header app-navbar></header>
    <section class="container">
      <app-menu  />
      <div class="content" [class.expanded]="layoutService.isMenuOpen$()">
        <router-outlet />
      </div>
    </section>
  `,
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected layoutService = inject(LayoutService);
}
