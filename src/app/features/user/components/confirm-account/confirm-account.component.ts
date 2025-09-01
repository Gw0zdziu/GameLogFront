import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {InputOtp} from 'primeng/inputotp';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmCodeDto} from '../../models/confirm-code.dto';
import {UserService} from '../../services/user.service';
import {ContainerComponent} from '../../../../shared/components/container/container.component';

@Component({
  selector: 'app-confirm-account',
  imports: [
    Button,
    InputOtp,
    ReactiveFormsModule,
    ContainerComponent
  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css'
})
export class ConfirmAccountComponent implements OnInit{
  private userService = inject(UserService);
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
    this.userService.resendConfirmCode(this.userId()).subscribe();
  }

  postConfirmCode(){
    const confirmCode = this.confirmCode.value as string;
    const confirmCodeDto: ConfirmCodeDto = {
      confirmCode: confirmCode,
      userId: this.userId()
    }
    this.userService.confirmUser(confirmCodeDto).subscribe(
      {
        next: () => {
          this.router.navigate(['login']);
        }
      }
    )
  }

}
