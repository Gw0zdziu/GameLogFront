import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {UserService} from '../user/services/user.service';
import {AuthService} from '../auth/services/auth.service';
import {Button} from 'primeng/button';
import {UserStoreService} from '../../core/store/user-store/user-store.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    Button,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private userStoreService = inject(UserStoreService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  user$ = this.userStoreService.currentUser;

  ngOnInit(): void {
    const userId = this.userStoreService.currentUser()?.userId as string;
    if (userId) {
      this.userService.getUser().subscribe({
        next: (value) => {
          this.userStoreService.updateUser(value);
        }
      })
    }
  }

  logout(){
    const userId = this.userStoreService.currentUser()?.userId as string;
    this.authService.logoutUser().subscribe({
      next: () => {
        this.userStoreService.cleanStore()
      }
    })
  }
}
