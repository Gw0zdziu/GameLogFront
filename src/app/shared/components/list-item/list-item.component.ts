import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
}
