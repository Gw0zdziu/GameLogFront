import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {InputOtp} from 'primeng/inputotp';

@Component({
  selector: 'app-confirm-account',
  imports: [
    Button,
    InputOtp
  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css'
})
export class ConfirmAccountComponent {

}
