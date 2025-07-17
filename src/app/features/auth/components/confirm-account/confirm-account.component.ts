import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {InputOtp} from 'primeng/inputotp';
import {AuthService} from '../../services/auth/auth.service';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmCodeDto} from '../../../shared/models/request/confirm-code.dto';

@Component({
  selector: 'app-confirm-account',
  imports: [
    Button,
    InputOtp,
    ReactiveFormsModule
  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css'
})
export class ConfirmAccountComponent implements OnInit{
  private authService = inject(AuthService);
  private activateRoute = inject(ActivatedRoute);
  private router = inject(Router);
  userId = signal('')
  confirmCode = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    const userIdParam = this.activateRoute.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId.set(userIdParam);
    }
  }

  postResendCode(){
    this.authService.resendConfirmCode(this.userId()).subscribe();
  }

  postConfirmCode(){
    const confirmCode = this.confirmCode.value as string;
    const confirmCodeDto: ConfirmCodeDto = {
      confirmCode: confirmCode,
      userId: this.userId()
    }
    this.authService.confirmUser(confirmCodeDto).subscribe(
      {
        next: () => {
          this.router.navigate(['login']);
        }
      }
    )
  }

}
