import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-resend-code-button',
  template: `
    <button class="button__resend" type="submit" (click)="resendCode()">Nowy kod</button>
  `,
  styleUrl: './resend-code-button.component.css'
})
export class ResendCodeButtonComponent {
  userId = input.required<string>();
  emitter = output();


  protected resendCode() {
    this.emitter.emit()
  }
}
