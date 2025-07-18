import {Component, inject, signal} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RegisterNewUserRequestDto} from '../../../shared/models/request/register-new-user-request.dto';
import {Router, RouterLink} from '@angular/router';
import {delay} from 'rxjs';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-registration',
  imports: [
    InputText,
    ReactiveFormsModule,
    Button,
    ButtonDirective,
    ButtonLabel,
    RouterLink,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent{
  isSubmit = signal(false);
  private userService = inject(UserService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  registerForm = this.formBuilder.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    firstname: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    userEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
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
