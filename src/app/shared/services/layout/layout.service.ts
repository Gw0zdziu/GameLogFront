import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly isMenuOpen = signal(false);
  readonly isMenuOpen$ = computed(() => {
    return this.isMenuOpen();
  })
  constructor() {
  }

  setStateMenu(value: boolean): void{
    this.isMenuOpen.set(value);
  }


  toggleMenu(): void{
    this.isMenuOpen.update(value =>{
      return !value;
    });
  }
}
