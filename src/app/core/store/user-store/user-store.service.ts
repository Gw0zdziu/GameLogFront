import {computed, effect, Injectable, signal} from '@angular/core';
import {GetUserDto} from '../../../shared/models/get-user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private user = signal<Partial<GetUserDto>| null>(JSON.parse(localStorage.getItem('user') as string));
  currentUser = computed(() => this.user());


  constructor() {
    effect(() => {
      const user = JSON.stringify(this.user())
      if (this.user() === null) {
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', user)
      }
    });
  }

  cleanStore(){
    this.user.set(null);
  }

  updateUser(user: Partial<GetUserDto> | null){
    this.user.set({...this.user(), ...user});

  }

}
