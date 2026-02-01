import { ChangeDetectionStrategy, Component,  input} from '@angular/core';
import {GameDto} from '../../../features/game/models/game.dto';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {
}
