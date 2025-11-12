import {Component, inject, OnInit, signal} from '@angular/core';
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
  styleUrl: './game-table.component.css'
})
export class GameTableComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  store = inject(GameStore);
  ref: DynamicDialogRef | undefined;
  columns = signal<Column<GameDto>[]>([]);

  ngOnInit(): void {
    this.store.getGames();
    this.columns.set([
      {
        header: 'Nazwa gry',
        field: 'gameName',
      },
      {
        header: 'Kategoria',
        field: 'categoryName',
      },
      {
        header: 'Data utworzenia',
        field: 'createdDate',
      },
      {
        header: 'Data aktualizacji',
        field: 'updatedDate',
      },
      {
        columnType: 'action',
        header: 'Akcje',
        actions: [
          {
            actionType: 'delete',
            toolTip: 'Usuń',
            label: 'Usuń',
            icon: 'pi pi-trash',
            action: (item) => {
              this.deleteGame(item.gameId);
            }
          },
          {
            actionType: 'edit',
            toolTip: 'Edytuj',
            label: 'Edytuj',
            icon: 'pi pi-pencil',
            action: (item) => {
              this.updateGame(item.gameId);
            }
          }
        ]
      }
    ])
  }

  deleteGame(gameId: string): void {
    this.confirmationService.confirm({
      message: 'Czy chcesz usunąć grę?',
      header: 'Usuwanie gry',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Anuluj',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Usuń',
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
      header: 'Zaktualizuj grę'
    })
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) return;
    });
  }
}
