import {Directive, HostListener, inject} from '@angular/core';
import {LayoutService} from '../../shared/services/layout/layout.service';

@Directive({
  selector: '[appCloseSidebar]',
  standalone: true,
})
export class CloseSidebarDirective {
  private layoutService = inject(LayoutService);

  @HostListener('click') onClick() {
    this.layoutService.setStateMenu(false);
  }

}
