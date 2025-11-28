import {Component, inject} from '@angular/core';
import {GameTableComponent} from './components/game-table/game-table.component';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameAddComponent} from './components/game-add/game-add.component';

@Component({
  selector: 'app-game',
  imports: [
    GameTableComponent,
    ButtonDirective,
    ButtonLabel
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  providers: [DialogService],
})
export class GameComponent {
  private dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

   openAddGameDialog() {
     this.ref = this.dialogService.open(GameAddComponent, {
       header: 'Dodaj nową kategorię',
       modal: true,
     })
     this.ref.onClose.subscribe((x: boolean) => {
       if (!x) return;
     });
  }
}
