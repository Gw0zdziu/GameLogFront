import {computed, effect, Injectable, signal} from '@angular/core';
import {GetUserDto} from '../../../models/response/get-user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private user = signal<Partial<GetUserDto>| null>(null);
  currentUser = computed(() => this.user());


  constructor() {
    effect(() => {
      console.log(this.user());
      const user = JSON.stringify(this.user())
      localStorage.setItem('user', user)
    });
    const user = localStorage.getItem('user');
    if (user) {
      this.user.set(JSON.parse(user));
    }
  }

  cleanStore(){
    this.user.set(null);
  }

  updateUser(user: Partial<GetUserDto> | null){
    this.user.set({...this.user(), ...user});

  }

}
