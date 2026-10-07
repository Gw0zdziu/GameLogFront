import {computed, effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {
  private readonly token = signal<string | null>(localStorage.getItem('token'));
  private readonly on
  readonly isLogged$ = computed(() => {
    const [header, payload, _] = this.token()?.split('.') ?? [];
    const expiredTimeInSeconds = JSON.parse(atob(payload)).exp;
    const expiredTime = new Date((expiredTimeInSeconds + 60) * 1000);
    return expiredTime >= new Date();
  });
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
