import {Component} from '@angular/core';

@Component({
  selector: 'app-container',
  imports: [],
  template: `
    <div class="container">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './container.component.css'
})
export class ContainerComponent {

}
