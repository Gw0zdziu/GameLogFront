import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginUserDto} from '../../models/login-user.dto';
import {Router, RouterLink} from '@angular/router';
import {ContainerComponent} from '../../../../shared/components/container/container.component';
import {ThemeToggleComponent} from '../../../theme-toggle/theme-toggle.component';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-login',
  imports: [
    InputText,
    ReactiveFormsModule,
    ButtonLabel,
    ButtonDirective,
    RouterLink,
    ContainerComponent,
    ThemeToggleComponent,
    Message
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
    userName: ['', {
      validators:[Validators.required],
      updateOn: 'blur',
    }],
    password: ['', {
      validators:[Validators.required],
      updateOn: 'blur',
    }],
  });

  loginUser(): void{
    if (this.loginForm.valid) {
      this.isLogin.set(true);
      const loginUser: LoginUserDto = this.loginForm.value as LoginUserDto;
      this.authService.loginUser(loginUser)
        .subscribe({
          next: () => {
            this.router.navigate(['']).finally();
          },
          error: () => {
            this.isLogin.set(false);
          },
          complete: () => this.isLogin.set(false)
        })
    } else {
      if (this.loginForm.controls.userName.value === '') {
        this.loginForm.controls.userName.markAsTouched();
      }
      if (this.loginForm.controls.password.value === '') {
        this.loginForm.controls.password.markAsTouched();
      }
    }
  }
}
