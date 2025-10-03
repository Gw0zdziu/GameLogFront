import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RegisterNewUserRequestDto} from '../../models/register-new-user-request.dto';
import {Router} from '@angular/router';
import {delay} from 'rxjs';
import {UserService} from '../../services/user.service';
import {ContainerComponent} from '../../../../shared/components/container/container.component';
import {Message} from 'primeng/message';
import {NgClass} from '@angular/common';
import {matchValueValidator} from '../../../../core/validators/match-value.validator';

@Component({
  selector: 'app-registration',
  imports: [
    InputText,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonLabel,
    ContainerComponent,
    Message,
    NgClass,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent{
  isSubmit = signal(false);
  private userService = inject(UserService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  registerForm = this.formBuilder.group({
    userName: ['',
      {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur',

  }],
    firstname: ['',
      {
        validators:[Validators.required, Validators.minLength(3)],
        updateOn: 'blur',
      }],
    lastname: ['',
      {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur',
      }],
    userEmail: ['',
      {
        validators:[Validators.required, Validators.email],
        updateOn: 'blur',
      }],
    password: ['',
      {
        validators:[Validators.required, Validators.minLength(8)],
        updateOn: 'blur',
      }],
    confirmPassword: ['',
      {
        validators:[Validators.required, Validators.minLength(8)],
        updateOn: 'blur',
      }],
  },{
    validators: [matchValueValidator('password', 'confirmPassword')]
  })



  postNewUser(){
    this.isSubmit.set(true);
    const newUser: RegisterNewUserRequestDto = this.registerForm.value as RegisterNewUserRequestDto;
    this.userService.registerNewUser(newUser).pipe(delay(500)).subscribe({
      next: (value) => this.router.navigate(['/confirm-account', value]),
      error: () => {
        this.isSubmit.set(false);
      },
      complete: () => this.isSubmit.set(false)
    })
  }

}
