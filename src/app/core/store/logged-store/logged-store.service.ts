import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedStoreService {
  private readonly isLogged = signal<boolean | null>(false);
  readonly isLogged$ = computed(() => {
    return this.isLogged();
  })

  setLogged(value: boolean): void{
    this.isLogged.set(value);
  }
}
