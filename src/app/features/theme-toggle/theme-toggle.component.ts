import {Component, inject, Renderer2} from '@angular/core';
import {Button} from 'primeng/button';
import {DOCUMENT} from '@angular/common';
import {ThemeStoreService} from '../../core/store/theme-store/theme-store.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [
    Button
  ],
  template:`
    <p-button (click)="toggleTheme()" class="theme-toggle" icon="pi pi-{{theme().icon}}" [rounded]="true" [text]="true"/>
  `,
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private themeStore = inject(ThemeStoreService);
  theme = this.themeStore.theme$;


  toggleTheme() {
    const currentTheme = !this.theme().isDark ? 'dark' : 'light';
    this.renderer.setAttribute(this.document.documentElement,'data-theme', currentTheme);
    this.themeStore.setTheme();
  }
}
