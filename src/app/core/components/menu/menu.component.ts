import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuItemComponent} from '../../../shared/components/menu-item/menu-item.component';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import {CloseSidebarDirective} from '../../directives/close-sidebar.directive';

@Component({
  selector: 'app-menu',
  imports: [
    MenuItemComponent,
    CloseSidebarDirective
  ],
  template: `
   <div class="sidebar" [class.closed]="isMenuOpen$()">
    <ul class="menu-sidebar">
      @for (item  of menuItems; track item.label) {
        <app-menu-item appCloseSidebar [item]="item"></app-menu-item>
      }
    </ul>
  </div>
  `,
  styleUrl: './menu.component.css',

})
export class MenuComponent implements OnInit{
  private layoutService = inject(LayoutService);
  isMenuOpen$ = this.layoutService.isMenuOpen$;
  menuItems: MenuItem[] | undefined = [];

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Pulpit nawigacyjny',
        icon: 'pi pi-fw pi-home',
        routerLink: './dashboard'
      },
      {
        label: 'Kategorie gier',
        icon: 'pi pi-fw pi-tags',
        routerLink: './categories'
      },
      {
        label: 'Gry',
        icon: 'pi pi-fw pi-video',
        routerLink: './games'
      }
    ]
  }
}
