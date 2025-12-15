import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameService} from '../../services/game.service';
import {GamePutDto} from '../../models/game-put.dto';
import {GameStore} from '../../store/game-store';
import {GameFormComponent} from '../game-form/game-form.component';
import {GameDto} from '../../models/game.dto';

@Component({
  selector: 'app-game-update',
  imports: [
    GameFormComponent
  ],
  templateUrl: './game-update.component.html',
  styleUrl: './game-update.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameUpdateComponent implements OnInit{
    private dynamicDialogRef = inject(DynamicDialogRef);
    private dialogService = inject(DialogService);
    private gameStore = inject(GameStore);
    private gameService = inject(GameService);
    instance: DynamicDialogComponent | undefined;
    gameId: string;
    readonly game = signal<GameDto | null>(null);

    constructor() {
      this.instance = this.dialogService.getInstance(this.dynamicDialogRef);

    }

    ngOnInit(): void {
      this.gameId = this.instance?.data;
      this.gameService.getGame(this.gameId).pipe(
      ).subscribe({
        next: value => {
          this.game.set({...value});
        }
      });
    }

  submitGame(updatedGame: GamePutDto): void  {
      this.gameStore.updateGame({
        gameId: this.gameId as string,
        updatedGame,
        onSuccess: () => {
          this.dynamicDialogRef.close(true);
        }
      })
    }
}
