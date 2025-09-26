import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../user/services/user.service';
import {NavbarComponent} from '../../core/components/navbar/navbar.component';
import {LayoutService} from '../../shared/services/layout/layout.service';
import {MenuComponent} from '../../core/components/menu/menu.component';
import {RouterOutlet} from '@angular/router';
import {LoggedStoreService} from '../../core/store/logged-store/logged-store.service';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    MenuComponent,
    RouterOutlet,
  ],
  template: `
    <app-navbar/>
    <section class="container">
      <app-menu/>
      <div class="content" [class.expanded]="isMenuOpen$()" >
        <router-outlet></router-outlet>
      </div>
    </section>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private userService = inject(UserService);
  private layoutService = inject(LayoutService);
  private loggedStoreService = inject(LoggedStoreService);
  isMenuOpen$ = this.layoutService.isMenuOpen$;

  ngOnInit(): void {
    if (this.loggedStoreService.isLogged$()) {
      this.userService.getUser().subscribe();
    }
  }
}
