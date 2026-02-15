import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedStoreService {
  private readonly isLogged = signal<boolean | null>(null);
  readonly isLogged$ = computed(() => {
    return this.isLogged();
  })

  constructor() {
    console.log(this.isLogged())
  }

  setLogged(value: boolean): void{
    this.isLogged.set(value);
  }
}
