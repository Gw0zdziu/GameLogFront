import {computed, effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedStoreService {
  private readonly isLogged = signal<boolean>(JSON.parse(localStorage.getItem('isLogged') as string)|| false);
  readonly isLogged$ = computed(() => {
    return this.isLogged();
  })

  constructor() {
    effect(() => {
        localStorage.setItem('isLogged', JSON.stringify(this.isLogged()));
      }
    )
  }

  setLogged(value: boolean){
    this.isLogged.set(value);
  }
}
