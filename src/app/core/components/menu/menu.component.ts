import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuItemComponent} from '../../../shared/components/menu-item/menu-item.component';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import {CloseSidebarDirective} from '../../directives/close-sidebar.directive';

@Component({
  selector: 'app-menu',
  imports: [
    MenuItemComponent
  ],
  hostDirectives:[
    {
      directive: CloseSidebarDirective
    }
  ],
  host: {
    '[class.closed]': 'isMenuOpen$()'
  },
  template: `
    <section class="sidebar">
      <ul class="menu-sidebar">
        @for (item  of menuItems; track item.label) {
          <app-menu-item  [item]="item"></app-menu-item>
        }
      </ul>
    </section>

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

  toggleMenu(){
    this.layoutService.toggleMenu();
  }
}
