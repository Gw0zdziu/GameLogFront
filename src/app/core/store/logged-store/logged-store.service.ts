import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedStoreService {
  private isLogged = signal(false);
  isLogged$ = computed(() => {
    return this.isLogged();
  })

  setLogged(value: boolean){
    this.isLogged.set(value);
  }
}
