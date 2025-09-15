import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {UserStoreService} from '../../store/user-store/user-store.service';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../../features/auth/services/auth.service';
import {LayoutService} from '../../../shared/services/layout/layout.service';

@Component({
  selector: 'app-navbar',
  imports: [
    Button,
    Menu
  ],
  styleUrl: './navbar.component.css',
  template: `
    <p-button (click)="toggleMenu()" class="menu-button" icon="pi pi-bars" [rounded]="false" [text]="true"/>
    <span class="logo">GameLog</span>
    <p-button class="theme-toggle" icon="pi pi-moon" [rounded]="true" [text]="true"/>
    <p-button (click)="menu.toggle($event)" class="user-button" icon="pi pi-user" [rounded]="true" [text]="true"/>
    <p-menu class="user-menu" #menu [model]="items" [popup]="true" />
  `,
})
export class NavbarComponent implements OnInit{
  private userStoreService = inject(UserStoreService);
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);
  user = this.userStoreService.currentUser;
  items: MenuItem[] | undefined = [

  ]

  ngOnInit(): void {
    if (this.user()) {
      this.items = [
        {
          label: 'Logout',
          icon: 'pi pi-fw pi-sign-out',
          command: () => this.logout()
        }
      ]
    } else {
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
  }

  toggleMenu(){
    this.layoutService.toggleMenu();
  }

  logout(){
    this.authService.logoutUser().subscribe({
      next: () => {
        this.userStoreService.cleanStore();
        this.items = [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            routerLink: ['login']
          },
          {
            label: 'Register',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['register']
          },
        ]
      }
    })
  }
}
