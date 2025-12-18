import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {AuthService} from '../../../features/auth/services/auth.service';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {ThemeToggleComponent} from '../../../features/theme-toggle/theme-toggle.component';

@Component({
  selector: 'header[app-navbar]',
  imports: [
    Button,
    Menu,
    ThemeToggleComponent
  ],
  styleUrl: './navbar.component.css',
  template: `
    <p-button ariaLabel="Menu button" class="menu-button" icon="pi pi-bars"
              [rounded]="false" [text]="true" (click)="toggleMenu()"/>
    <span class="logo">GameLog</span>
    <app-theme-toggle />
    <p-button ariaLabel="User Button"
              class="user-button" icon="pi pi-user" [rounded]="true" [text]="true" (click)="menu.toggle($event)"/>
    <p-menu #menu class="user-menu" [model]="items()" [popup]="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);
  private loggedStoreService = inject(LoggedStoreService);
  isLogged$ = this.loggedStoreService.isLogged$;
  readonly items = computed(() =>{
    if (this.isLogged$()) {
      return [
        {
          label: $localize`Wyloguj`,
          icon: 'pi pi-fw pi-sign-out',
          command: (): void => this.logout()
        }
      ]
    } else {
      return [
        {
          label: $localize`Zaloguj`,
          icon: 'pi pi-fw pi-sign-in',
          routerLink: ['/login'],
        },
        {
          label: $localize`Zarejestruj`,
          icon: 'pi pi-fw pi-user-plus',
          routerLink: ['/registration']
        },
      ]
    }
  });

  constructor() {
  }



  toggleMenu(): void{
    this.layoutService.toggleMenu();
  }

  logout(): void{
    this.authService.logoutUser().subscribe()
  }
}
