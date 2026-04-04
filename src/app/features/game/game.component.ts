import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {GameListComponent} from './components/game-list/game-list.component';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameAddComponent} from './components/game-add/game-add.component';

@Component({
  selector: 'app-game',
  imports: [
    ButtonDirective,
    ButtonLabel,
    GameListComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  private dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

   openAddGameDialog(): void {
     this.ref = this.dialogService.open(GameAddComponent, {
       header: $localize`Nowa gra`,
       modal: true,
       dismissableMask: true,
       closable: true,
       focusOnShow: false,
     })
     this.ref.onClose.subscribe((x: boolean) => {
       if (!x) {return;}
     });
  }
}
