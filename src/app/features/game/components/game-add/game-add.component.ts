import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {GamePostDto} from '../../models/game-post.dto';
import {GameFormComponent} from '../game-form/game-form.component';

@Component({
  selector: 'app-game-add',
  imports: [
    GameFormComponent
  ],
  templateUrl: './game-add.component.html',
  styleUrl: './game-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameAddComponent {
    private dynamicDialogRef = inject(DynamicDialogRef);
    private gameStore = inject(GameStore);

    submitNewGame(newGame: GamePostDto): void{
      this.gameStore.postGame({
        newGame: newGame,
        onSuccess: () => {
          this.dynamicDialogRef.close(true);
        }
      });
    }

}
