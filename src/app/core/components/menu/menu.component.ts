import {ChangeDetectionStrategy, Component, computed, inject, Signal} from '@angular/core';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {MenuItemComponent} from '../../../shared/components/menu-item/menu-item.component';
import {ButtonDirective} from 'primeng/button';
import {faGamepad, faLayerGroup, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MenuItem} from '../../models/menu-item';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-menu',
  imports: [
    MenuItemComponent,
    ButtonDirective,
    FaIconComponent,
  ],
  host: {
    '[class.opened]': 'isMenuOpen$()'
  },
  template: `
    <section class="container">
      <div class="container__button">
        <button pButton type="button"
                [rounded]="true" [text]="true" (click)="toggleMenu()">
          <fa-icon size="lg" [icon]="faTimes"/>
        </button>
      </div>
      <ul class="container__list">
        @for (item of menuItems(); track item.label) {
          <li app-menu-item [item]="item"></li>
        }
      </ul>
    </section>
  `,
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  private layoutService = inject(LayoutService);
  private loggedStoreService = inject(LoggedStoreService);
  isLogged$ = this.loggedStoreService.isLogged$;
  isMenuOpen$ = this.layoutService.isMenuOpen$;
  faTimes = faTimes;
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

