import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../../features/auth/services/auth.service';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {ThemeToggleComponent} from '../../../features/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  imports: [
    Button,
    Menu,
    ThemeToggleComponent
  ],
  styleUrl: './navbar.component.css',
  template: `
    <p-button (click)="toggleMenu()" class="menu-button" icon="pi pi-bars" [rounded]="false" [text]="true"/>
    <span class="logo">GameLog</span>
    <app-theme-toggle></app-theme-toggle>
    <p-button (click)="menu.toggle($event)" class="user-button" icon="pi pi-user" [rounded]="true" [text]="true"/>
    <p-menu class="user-menu" #menu [model]="items" [popup]="true" />
  `,
})
export class NavbarComponent implements OnInit{
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);
  private loggedStoreService = inject(LoggedStoreService);
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    if (this.loggedStoreService.isLogged$()) {
      this.items = [
        {
          label: 'Wyloguj',
          icon: 'pi pi-fw pi-sign-out',
          command: () => this.logout()
        }
      ]
    } else {
      this.items = [
        {
          label: 'Zaloguj',
          icon: 'pi pi-fw pi-sign-in',
          routerLink: ['/login'],
        },
        {
          label: 'Zarejestruj',
          icon: 'pi pi-fw pi-user-plus',
          routerLink: ['/registration']
        },
      ]
    }
  }

  toggleMenu(){
    this.layoutService.toggleMenu();
  }

  logout(){
    this.authService.logoutUser().subscribe({
      next: () => {
        this.items = [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            routerLink: ['/login']
          },
          {
            label: 'Register',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['/registration']
          },
        ]
      }
    })
  }
}
