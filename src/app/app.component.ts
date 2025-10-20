import {Component, inject, OnInit, Renderer2} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './features/auth/services/auth.service';
import {ThemeStoreService} from './core/store/theme-store/theme-store.service';
import {DOCUMENT} from '@angular/common';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Toast,
    ConfirmDialog,
    TableModule
  ],
  template: `
  <router-outlet/>
  <p-toast position="bottom-center"></p-toast>
  <p-confirmdialog></p-confirmdialog>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = 'GameLogFront';
  private authService = inject(AuthService);
  private themeStore = inject(ThemeStoreService);
  themeState$ = this.themeStore.theme$();
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    this.renderer.setAttribute(this.document.documentElement,'dark-theme', this.themeState$.theme);
    const element = this.document.querySelector('html') as HTMLHtmlElement;
    if (this.themeState$.theme === 'dark') {
      element.classList.add(this.themeState$.theme);
    } else {
      element.classList.remove(this.themeState$.theme);
    }
  }
}
