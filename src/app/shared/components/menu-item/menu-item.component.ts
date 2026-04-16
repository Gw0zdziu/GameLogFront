import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {CloseSidebarDirective} from '../../../core/directives/close-sidebar.directive';
import {FaIconComponent, FontAwesomeModule, IconDefinition} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'li[app-menu-item]',
  imports: [
    RouterLink,
    RouterLinkActive,
    CloseSidebarDirective,
    FaIconComponent,
  ],
  host: {
    class: 'menu-item'
  },
  template: `
    <a appCloseSidebar class="item-link" [routerLink]="[item()?.routerLink]"
       [routerLinkActive]="['active']">
      <fa-icon size="xl" [icon]="item()?.icon" />
      {{ item()?.label }}</a>
  `,
  styleUrl: './menu-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemComponent {
  readonly item = input<{label: string, icon: any, routerLink: string}>();
}
