import {computed, effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LangStoreService {
  private readonly language = signal<string>(localStorage.getItem('lang') || 'pl');
  readonly language$ = computed(() => this.language())
  constructor() {
    effect(() => {
      localStorage.setItem('lang', this.language());
    });
  }

  setLanguage(lang: string): void{
    this.language.set(this.language$() === 'pl' ? 'gb' : 'pl');
  }
}
