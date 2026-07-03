import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ThemeToggleComponent} from '../../../theme-toggle/theme-toggle.component';
import {Password} from 'primeng/password';
import {LangToggleComponent} from '../../../lang-toggle/lang-toggle.component';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {UserStore} from '../../../../core/store/user-store/user-store';
import {AuthService} from '../../services/auth.service';
import {LoginUserDto} from '../../models/login-user.dto';


@Component({
  selector: 'app-login',
  imports: [
    InputText,
    ReactiveFormsModule,
    ButtonLabel,
    ButtonDirective,
    RouterLink,
    ThemeToggleComponent,
    Password,
    LangToggleComponent,
    FaIconComponent,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private userStore = inject(UserStore);
  private router = inject(Router);
  readonly isLogin = signal(false);
  faSpinner = faSpinner;

  loginUser(form: NgForm): void{
    if (form.valid) {
      this.isLogin.set(true);
      const loginUser: LoginUserDto = form.value as LoginUserDto;
      this.authService.loginUser(loginUser)
        .subscribe({
          next: () => {
            this.userStore.getUser();
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
