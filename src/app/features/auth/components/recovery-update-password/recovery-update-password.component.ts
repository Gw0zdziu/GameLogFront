import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {RecoveryUpdatePasswordDto} from '../../../shared/models/request/recovery-update-password.dto';
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-recovery-update-password',
  imports: [
    Button,
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './recovery-update-password.component.html',
  styleUrl: './recovery-update-password.component.css'
})
export class RecoveryUpdatePasswordComponent implements OnInit{
  private userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  isSubmit = signal(false);
  recoveryUpdatePassword: Partial<RecoveryUpdatePasswordDto> | undefined;

  newPasswordForm = this.formBuilder.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe({
      next: (value) => {
        if (value.has('token') && value.has('id')) {
          const token = value.get('token') as string;
          const id = value.get('id') as string;
          this.recoveryUpdatePassword = {
            ...this.recoveryUpdatePassword, token: token, userId: id
          }
        }
      }
    })
  }

  postRecoveryUpdatePassword() {
    this.isSubmit.set(true);
    this.recoveryUpdatePassword = {
      ...this.recoveryUpdatePassword,
      newPassword: this.newPasswordForm.controls.password.value as string,
      confirmPassword: this.newPasswordForm.controls.confirmPassword.value as string,
    };
    this.userService.recoveryUpdatePassword(this.recoveryUpdatePassword as RecoveryUpdatePasswordDto).subscribe({
      next: value => {
        this.isSubmit.set(false);
        this.router.navigate(['login'], {
          relativeTo: this.activatedRoute,
        });
      },
      error: () =>{
        this.isSubmit.set(false);
      },
      complete: () => {
        this.isSubmit.set(false);
      }
    });
  }
}
