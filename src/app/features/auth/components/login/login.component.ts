import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginUserDto} from '../../models/login-user.dto';
import {Router, RouterLink} from '@angular/router';
import {ContainerComponent} from '../../../../shared/components/container/container.component';
import {ThemeToggleComponent} from '../../../theme-toggle/theme-toggle.component';
import {Password} from 'primeng/password';
import {LangToggleComponent} from '../../../lang-toggle/lang-toggle.component';
import {concatMap} from 'rxjs';
import {UserService} from '../../../user/services/user.service';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

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
    Password,
    LangToggleComponent,
    FaIconComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  readonly isLogin = signal(false);
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
  faSpinner = faSpinner;

  loginUser(): void{
    if (this.loginForm.valid) {
      this.isLogin.set(true);
      const loginUser: LoginUserDto = this.loginForm.value as LoginUserDto;
      this.authService.loginUser(loginUser)
        .pipe(
          concatMap(() => {
            return this.userService.getUser();
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(['home'], ).then(() =>
              this.isLogin.set(false));
          },
          error: () => {
            this.isLogin.set(false);
          }
        })
    }
  }

}
