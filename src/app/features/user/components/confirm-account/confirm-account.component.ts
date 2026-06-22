import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {LangToggleComponent} from '../../../lang-toggle/lang-toggle.component';
import {ThemeToggleComponent} from '../../../theme-toggle/theme-toggle.component';
import {InputOtpComponent} from '../input-otp/input-otp.component';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-confirm-account',
  imports: [
    ReactiveFormsModule,
    LangToggleComponent,
    ThemeToggleComponent,
    InputOtpComponent,
    ButtonDirective,
    ButtonLabel,
    FaIconComponent
  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAccountComponent implements OnInit{
  private activateRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  userId = '';
  otpInputControl = new FormControl({ value: '', disabled: false });
  isSubmit = signal<boolean>(false);
  faSpinner = faSpinner;

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.paramMap.get('userId') as string;
  }

  protected submit(): void{
    if (this.otpInputControl.value){
      this.isSubmit.set(true);
      this.userService.confirmUser(this.userId, this.otpInputControl.value)
      .subscribe({
        next: () => {
          this.isSubmit.set(false);
          this.router.navigate(['login']).finally();
        },
        error: () => {
          this.isSubmit.set(false);
        }
      })
      }
  }

  protected resendCode() {
    this.userService.resendConfirmationCode(this.userId)
      .subscribe({
        next: () => {
          this.otpInputControl.setValue('');
        },
        error: () => {
        }
      }
      )
  }
}
