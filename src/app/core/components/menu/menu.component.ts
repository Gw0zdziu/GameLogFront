import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout/layout.service';
import { CloseSidebarDirective } from '../../directives/close-sidebar.directive';
import { LoggedStoreService } from '../../store/logged-store/logged-store.service';
import { MenuItemComponent } from '../../../shared/components/menu-item/menu-item.component';

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
        @for (item of menuItems(); track item.label) {
          <li app-menu-item [item]="item"></li>
        }
      </ul>
    </section>

  `,
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit{
  private layoutService = inject(LayoutService);
  private loggedStoreService = inject(LoggedStoreService);
  isLogged$ = this.loggedStoreService.isLogged$;
  isMenuOpen$ = this.layoutService.isMenuOpen$;
  menuItems = computed(() => {
    if (this.isLogged$()) {
      return [
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
    } else {
      return []
    }
  })

  ngOnInit(): void {
  }
}
