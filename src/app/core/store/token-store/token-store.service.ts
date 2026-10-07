import {computed, effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {
  private readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly token$ = computed(() => this.token());


  constructor() {
    effect(() => {
      if (this.token() === null) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', this.token$() as string)
      }
    });
  }

  setToken(token: string | null): void{
    this.token.set(token);
  }

  clearToken(): void{
    this.token.set(null);
  }

}
