import { Component } from '@angular/core';
import {Button, ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-submit-recovery-password',
  imports: [
    Button,
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText
  ],
  templateUrl: './submit-recovery-password.component.html',
  styleUrl: './submit-recovery-password.component.css'
})
export class SubmitRecoveryPasswordComponent {

}
