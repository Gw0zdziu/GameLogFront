import {Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-menu-item',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <li class="menu-item">
      <a class="item-link" [routerLinkActive]="['active']" [routerLink]="[item()?.routerLink]" >{{item()?.label}}</a>
    </li>
  `,
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {
  item = input<MenuItem>();
}
