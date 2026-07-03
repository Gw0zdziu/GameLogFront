import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {LangToggleComponent} from '../../../lang-toggle/lang-toggle.component';
import {ThemeToggleComponent} from '../../../theme-toggle/theme-toggle.component';
import {InputOtpComponent} from '../input-otp/input-otp.component';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../services/user.service';
import {ResendCodeButtonComponent} from '../resend-code-button/resend-code-button.component';
import {TimerComponent} from '../timer/timer.component';

@Component({
  selector: 'app-confirm-account',
  imports: [
    ReactiveFormsModule,
    LangToggleComponent,
    ThemeToggleComponent,
    InputOtpComponent,
    ButtonDirective,
    ButtonLabel,
    FaIconComponent,

  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmAccountComponent implements OnInit, AfterViewInit{
  private activateRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  userId = '';
  otpInputControl = new FormControl({ value: '', disabled: false });
  isSubmit = signal<boolean>(false);
  faSpinner = faSpinner;
  container = viewChild.required('container', {
    read: ViewContainerRef
  })


  ngOnInit(): void {

    this.userId = this.activateRoute.snapshot.paramMap.get('userId') as string;
  }

  ngAfterViewInit() {
    this.createResendCodeButton();
  }

  createResendCodeButton() {
    this.container().clear()
    const ref = this.container().createComponent(ResendCodeButtonComponent)
    ref.setInput('userId', this.userId);
    ref.instance.emitter.subscribe(() => this.resendCode());
  }

  submit(): void{
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

  resendCode(): void {
    this.userService.resendConfirmationCode(this.userId)
      .subscribe({
        next: () => {
          this.container().clear()
          const ref = this.container().createComponent(TimerComponent);
          ref.setInput('minutesInput', 2);
          ref.instance.emitter.subscribe(() => {
            this.createResendCodeButton()
          })
        }
      })
  }
}
