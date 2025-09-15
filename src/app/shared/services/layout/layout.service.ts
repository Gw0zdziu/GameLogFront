import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private isMenuOpen = signal(false);
  isMenuOpen$ = computed(() => {
    return this.isMenuOpen();
  })
  constructor() {
  }



  toggleMenu(){
    this.isMenuOpen.update(value => !value);
  }
}
