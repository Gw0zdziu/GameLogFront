import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {Column} from '../../../../shared/models/column';
import {GameDto} from '../../models/game.dto';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameUpdateComponent} from '../game-update/game-update.component';
import {FormatDateDistancePipe} from '../../../../core/pipes/format-date-distance.pipe';
import {Button} from 'primeng/button';
import {ListItemComponent} from '../../../../shared/components/list-item/list-item.component';

@Component({
  selector: 'app-game-list',
  imports: [
    Button,
    FormatDateDistancePipe,
    ListItemComponent
  ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameListComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  store = inject(GameStore);
  ref: DynamicDialogRef | undefined;
  emptyMessage = $localize`Brak gier`;

  ngOnInit(): void {
    this.store.getGames();
  }

  deleteGame(gameId: string): void {
    this.confirmationService.confirm({
      message: $localize`Czy chcesz usunąć grę?`,
      header: $localize`Usuwanie gry`,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: $localize`Anuluj`,
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: $localize`Usuń`,
        severity: 'danger',
      },
      accept: () => {
        this.store.deleteGame(gameId);
      }
    })
  }

  updateGame(gameId: string): void{
    this.ref = this.dialogService.open(GameUpdateComponent,{
      modal: true,
      data: gameId,
      header: $localize`Zaktualizuj grę`
    })
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) {return;}
    });
  }
}
