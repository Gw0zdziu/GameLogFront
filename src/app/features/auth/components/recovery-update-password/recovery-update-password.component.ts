import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {RecoveryUpdatePasswordDto} from '../../models/recovery-update-password.dto';
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {UserService} from '../../../user/services/user.service';
import {ContainerComponent} from '../../../../shared/components/container/container.component';
import {matchValueValidator} from '../../../../core/validators/match-value.validator';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-recovery-update-password',
  imports: [
    Button,
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    RouterLink,
    ContainerComponent,
    Message
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
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required,Validators.minLength(8)]],
  },{
    validators: [matchValueValidator('password', 'confirmPassword')]
  })

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe({
      next: (value) => {
        if (value.has('token') && value.has('userId')) {
          const token = value.get('token') as string;
          const id = value.get('userId') as string;
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
    } as RecoveryUpdatePasswordDto
    this.userService.recoveryUpdatePassword(this.recoveryUpdatePassword as RecoveryUpdatePasswordDto).subscribe({
      next: () => {
        this.isSubmit.set(false);
        this.router.navigate(['login']);
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
