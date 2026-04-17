import {ChangeDetectionStrategy, Component, inject, Renderer2} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {DOCUMENT} from '@angular/common';
import {ThemeStoreService} from '../../core/store/theme-store/theme-store.service';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faMoon, faPencil, faSun} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-theme-toggle',
  imports: [
    ButtonDirective,
    FaIconComponent
  ],
  template:`
    <button pButton  type="button"
            [rounded]="true" [text]="true" (click)="toggleTheme()">
      <fa-icon size="lg" [icon]="theme().isDark ? faMoon : faSun" />
    </button>
  `,
  styleUrl: './theme-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private themeStore = inject(ThemeStoreService);
  theme = this.themeStore.theme$;
  faMoon = faMoon;
  faSun = faSun


  toggleTheme(): void {
    const currentTheme = !this.theme().isDark ? 'dark' : 'light';
    this.renderer.setAttribute(this.document.documentElement,'dark-theme', currentTheme);
    const element = this.document.querySelector('html') as HTMLHtmlElement;
    if (currentTheme === 'dark') {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
    this.themeStore.setTheme();
  }

}
