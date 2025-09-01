import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ContainerComponent} from '../../../../shared/components/container/container.component';

@Component({
  selector: 'app-submit-recovery-password',
  imports: [
    FormsModule,
    ContainerComponent,
  ],
  templateUrl: './submit-recovery-password.component.html',
  styleUrl: './submit-recovery-password.component.css'
})
export class SubmitRecoveryPasswordComponent {

}
