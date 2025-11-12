import {Component, inject, OnInit, signal} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameService} from '../../services/game.service';
import {GamePutDto} from '../../models/game-put.dto';
import {GameStore} from '../../store/game-store';
import {GameFormComponent} from '../game-form/game-form.component';

@Component({
  selector: 'app-game-update',
  imports: [
    GameFormComponent
  ],
  templateUrl: './game-update.component.html',
  styleUrl: './game-update.component.css'
})
export class GameUpdateComponent implements OnInit{
    private dynamicDialogRef = inject(DynamicDialogRef);
    private dialogService = inject(DialogService);
    private gameStore = inject(GameStore);
    private gameService = inject(GameService);
    instance: DynamicDialogComponent | undefined;
    gameId: string;
    game = signal<GamePutDto | null>(null);

    constructor() {
      this.instance = this.dialogService.getInstance(this.dynamicDialogRef);

    }

    ngOnInit() {
      this.gameId = this.instance?.data;
      this.gameService.getGame(this.gameId).pipe(
      ).subscribe({
        next: value => {
          const game: GamePutDto = {
            gameName: value.gameName,
            categoryId: value.categoryId,
          }
          this.game.set(game);
        }
      });
    }

  submitGame(updatedGame: GamePutDto) {
      this.gameStore.updateGame({
        gameId: this.gameId as string,
        updatedGame,
        onSuccess: () => {
          this.dynamicDialogRef.close(true);
        }
      })
    }
}
