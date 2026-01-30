import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {Column} from '../../../../shared/models/column';
import {GameDto} from '../../models/game.dto';
import {TableComponent} from '../../../../shared/components/table/table/table.component';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameUpdateComponent} from '../game-update/game-update.component';

@Component({
  selector: 'app-game-table',
  imports: [
    TableComponent
  ],
  templateUrl: './game-table.component.html',
  styleUrl: './game-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameTableComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  store = inject(GameStore);
  ref: DynamicDialogRef | undefined;
  readonly columns = signal<Column<GameDto>[]>([]);
  emptyMessage = $localize`Brak gier`;

  ngOnInit(): void {
    this.store.getGames();
    this.columns.set([
      {
        header: $localize`Nazwa gry`,
        field: 'gameName',
      },
      {
        header: $localize`Kategoria`,
        field: 'categoryName',
      },
      {
        header: $localize`Utworzono`,
        field: 'createdDate',
      },
      {
        header: $localize`Zaktualizowano`,
        field: 'updatedDate',
      },
      {
        columnType: 'action',
        header: $localize`Akcje`,
        actions: [
          {
            actionType: 'delete',
            toolTip: $localize`Usuń`,
            label: 'Usuń',
            icon: 'pi pi-trash',
            action: (item) : void=> {
              this.deleteGame(item.gameId);
            }
          },
          {
            actionType: 'edit',
            toolTip: $localize`Edytuj`,
            label: 'Edytuj',
            icon: 'pi pi-pencil',
            action: (item): void => {
              this.updateGame(item.gameId);
            }
          }
        ]
      }
    ])
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
