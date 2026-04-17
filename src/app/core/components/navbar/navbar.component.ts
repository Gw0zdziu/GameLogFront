import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {AuthService} from '../../../features/auth/services/auth.service';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {ThemeToggleComponent} from '../../../features/theme-toggle/theme-toggle.component';
import {LangToggleComponent} from '../../../features/lang-toggle/lang-toggle.component';
import {Router} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBars, faUser } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'header[app-navbar]',
  imports: [
    Menu,
    ThemeToggleComponent,
    LangToggleComponent,
    ButtonDirective,
    FaIconComponent
  ],
  styleUrl: './navbar.component.css',
  template: `
    <button pButton  type="button"
            [rounded]="true" [text]="true" (click)="toggleMenu()">
      <fa-icon size="lg" [icon]="faBar" />
    </button>
    <span class="logo">GameLog</span>

    <app-lang-toggle/>
    <app-theme-toggle />
    <!--<p-button ariaLabel="User Button"
              class="user-button" icon="pi pi-user" [rounded]="true" [text]="true" (click)="menu.toggle($event)"/>-->
    <button pButton  type="button"
            [rounded]="true" [text]="true" (click)="menu.toggle($event)">
      <fa-icon size="lg" [icon]="faUser" />
    </button>
    <p-menu #menu class="user-menu" [model]="items()" [popup]="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);
  private loggedStoreService = inject(LoggedStoreService);
  private router = inject(Router);
  isLogged$ = this.loggedStoreService.isLogged$;
  faUser = faUser;
  faBar = faBars
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

  toggleMenu(): void{
    this.layoutService.toggleMenu();
  }

  logout(): void{
    this.authService.logoutUser().subscribe(
      {
        next: () => {
          this.router.navigate(['./login']);
        }
      }
    )
  }

}
