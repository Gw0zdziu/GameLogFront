import {computed, effect, Injectable, signal} from '@angular/core';

export type Theme = 'light' | 'dark';
export type IconTheme = 'sun' | 'moon';
export interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  icon: IconTheme
}


@Injectable({
  providedIn: 'root'
})
export class ThemeStoreService {
  themeStore: ThemeStore = {
    theme: 'light',
    isDark: false,
    icon: 'sun'
  }
  private theme = signal<ThemeStore>(JSON.parse(localStorage.getItem('theme') as string)|| this.themeStore);
  theme$ = computed(() => {
    return this.theme();
  });

  constructor() {
    effect(() => {
      localStorage.setItem('theme', JSON.stringify(this.theme()));
      }
    )
  }


  setTheme(){
    const theme: ThemeStore = {
      theme: this.theme().theme === 'light' ? 'dark' : 'light',
      isDark: this.theme().theme === 'light',
      icon: this.theme().theme === 'light' ? 'sun' : 'moon'
    }
    this.theme.set(theme);
  }
}
