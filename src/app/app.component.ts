import {Component, inject, OnInit, Renderer2} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './features/auth/services/auth.service';
import {ThemeStoreService} from './core/store/theme-store/theme-store.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  template: `<router-outlet>
  </router-outlet>`,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'GameLogFront';
  private authService = inject(AuthService);
  private themeStore = inject(ThemeStoreService);
  theme = this.themeStore.theme$();
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    this.authService.verify().subscribe();
    this.renderer.setAttribute(this.document.documentElement,'data-theme', this.theme.theme);
  }
}
