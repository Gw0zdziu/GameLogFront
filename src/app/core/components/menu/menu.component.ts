import {ChangeDetectionStrategy, Component, computed, inject, Signal} from '@angular/core';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {MenuItemComponent} from '../../../shared/components/menu-item/menu-item.component';
import {Button} from 'primeng/button';
import {CloseSidebarDirective} from '../../directives/close-sidebar.directive';
import {faGamepad, faLayerGroup} from '@fortawesome/free-solid-svg-icons';
import {MenuItem} from '../../../features/game/models/menu-item';



@Component({
  selector: 'app-menu',
  imports: [
    MenuItemComponent,
    Button,
  ],
  host: {
    '[class.opened]': 'isMenuOpen$()'
  },
  template: `
    <section  class="sidebar">
      <div class="container-icon">
        <p-button ariaLabel="Menu button" icon="pi pi-chevron-left"
                  [rounded]="false" [text]="true" (click)="toggleMenu()"/>
      </div>
      <ul class="menu-sidebar">
        @for (item of menuItems(); track item.label) {
          <li app-menu-item  [item]="item"></li>
        }
      </ul>
    </section>
  `,
  hostDirectives:[
    {
      directive: CloseSidebarDirective
    }
  ],
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MenuComponent {
  private layoutService = inject(LayoutService);
  private loggedStoreService = inject(LoggedStoreService);
  isLogged$ = this.loggedStoreService.isLogged$;
  isMenuOpen$ = this.layoutService.isMenuOpen$;
  readonly menuItems: Signal<MenuItem[] > = computed(() => {
    if (this.isLogged$()) {
      return [
        {
          label: $localize`Kategorie gier`,
          icon: faLayerGroup,
          routerLink: './categories'
        },
        {
          label: $localize`Gry`,
          icon: faGamepad,
          routerLink: './games'
        }
      ]
    } else {
      return []
    }
  })

  toggleMenu(): void{
    this.layoutService.toggleMenu();
  }

}

export default MenuComponent
