import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginUserDto} from '../../models/login-user.dto';
import {Router, RouterLink} from '@angular/router';
import {UserStoreService} from '../../../../core/store/user-store/user-store.service';
import {ContainerComponent} from '../../../../shared/components/container/container.component';

@Component({
  selector: 'app-login',
  imports: [
    InputText,
    ReactiveFormsModule,
    ButtonLabel,
    ButtonDirective,
    RouterLink,
    ContainerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private userStoreService = inject(UserStoreService)
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  isLogin = signal(false);
  loginForm = this.formBuilder.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  loginUser(): void{
    this.isLogin.set(true);
    const loginUser: LoginUserDto = this.loginForm.value as LoginUserDto;
    this.authService.loginUser(loginUser)
      .subscribe({
      next: () => {
        this.router.navigate([''])
      },
      error: () => {
        this.isLogin.set(false);
      },
      complete: () => this.isLogin.set(false)
    })
  }
}
