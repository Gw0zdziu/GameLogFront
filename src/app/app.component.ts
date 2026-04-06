import {Component, Inject, inject, LOCALE_ID, OnInit, Renderer2, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ThemeStoreService} from './core/store/theme-store/theme-store.service';
import {DOCUMENT} from '@angular/common';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {ProgressSpinner} from 'primeng/progressspinner';
import {LoggedStoreService} from './core/store/logged-store/logged-store.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Toast,
    ConfirmDialog,
    TableModule,
    ProgressSpinner,
  ],
  template: `
    @if (loading$()) {
      <div class="spinner">
        <p-progress-spinner ariaLabel="loading" />
      </div>
    } @else {
    <router-outlet/>
    <p-toast position="bottom-center" [life]="2000"/>
    <p-confirmdialog ariaLabel="Confirm dialog" />
    }
  `,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = 'GameLogFront';
  private themeStore = inject(ThemeStoreService);
  themeState$ = this.themeStore.theme$();
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  constructor(
    @Inject(LOCALE_ID) public activeLocale: string
  ) {
  }
  store = inject(LoggedStoreService)
  isLogged$ = this.store.isLogged$;
  readonly loading$ = signal<boolean>(true)

  ngOnInit(): void {
    if (this.loading$ !== null){
      this.loading$.set(false)
    }
    this.renderer.setAttribute(this.document.documentElement,'dark-theme', this.themeState$.theme);
    const element = this.document.querySelector('html') as HTMLHtmlElement;
    if (this.themeState$.theme === 'dark') {
      element.classList.add(this.themeState$.theme);
    } else {
      element.classList.remove(this.themeState$.theme);
    }
  }
}
