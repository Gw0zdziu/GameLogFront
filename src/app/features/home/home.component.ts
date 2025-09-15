import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../user/services/user.service';
import {UserStoreService} from '../../core/store/user-store/user-store.service';
import {NavbarComponent} from '../../core/components/navbar/navbar.component';
import {LayoutService} from '../../shared/services/layout/layout.service';
import {MenuComponent} from '../../core/components/menu/menu.component';
import {RouterOutlet} from '@angular/router';

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
  private userStoreService = inject(UserStoreService);
  private userService = inject(UserService);
  private layoutService = inject(LayoutService);
  isMenuOpen$ = this.layoutService.isMenuOpen$;

  ngOnInit(): void {
    const userId = this.userStoreService.currentUser()?.userId as string;
    if (userId) {
      this.userService.getUser().subscribe({
        next: (value) => {
          this.userStoreService.updateUser(value);
        }
      })
    }
  }
}
