import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {AuthService} from '../../services/auth/auth.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginUserDto} from '../../../shared/models/request/login-user.dto';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    InputText,
    ReactiveFormsModule,
    ButtonLabel,
    ButtonDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
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
        this.router.navigate(['']);
      },
      error: () => {
        this.isLogin.set(false);
      },
      complete: () => this.isLogin.set(false)
    })
  }
}
