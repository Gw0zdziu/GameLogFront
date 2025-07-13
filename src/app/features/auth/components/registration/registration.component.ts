import {Component, inject} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-registration',
  imports: [
    InputText,
    Button
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  private authService = inject(AuthService);
}
