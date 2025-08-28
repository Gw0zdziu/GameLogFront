import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../../../user/services/user.service';

@Component({
  selector: 'app-recovery-password',
  imports: [
    InputText,
    FormsModule,
    ReactiveFormsModule,
    Button,
    ButtonDirective,
    ButtonLabel,
    RouterLink
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css'
})
export class RecoveryPasswordComponent {
    private userService = inject(UserService);
    private router = inject(Router);
    userEmail = new FormControl('', {
      validators: [Validators.required, Validators.email]
    });
    isSubmit = signal(false);


    postRecoveryPassword(){
      this.isSubmit.set(true);
      const userEmail: string = this.userEmail.value as string;
      this.userService.recoveryPassword(userEmail).subscribe({
        next: () => {
          this.router.navigate(['submit-recovery-password']);
          this.isSubmit.set(false);
        },
        error: () => {
          this.isSubmit.set(false);
        },
        complete: () => this.isSubmit.set(false)
      })
    }
}
