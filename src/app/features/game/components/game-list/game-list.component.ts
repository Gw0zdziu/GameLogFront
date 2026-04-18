import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameUpdateComponent} from '../game-update/game-update.component';
import {Button, ButtonDirective} from 'primeng/button';
import {ListItemComponent} from '../../../../shared/components/list-item/list-item.component';
import {FormatDatePipe} from '../../../../core/pipes/format-date.pipe';
import {IndexItemList} from '../../../../shared/models/index-item-list';
import {PaginationConfig} from '../../../../shared/models/pagination-config';
import {GameService} from '../../services/game.service';
import {GameDto} from '../../models/game.dto';
import {PaginatorComponent} from '../../../../shared/components/paginator/paginator.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faPencil, faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game-list',
  imports: [
    ListItemComponent,
    FormatDatePipe,
    PaginatorComponent,
    ButtonDirective,
    FaIconComponent
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
  readonly paginationState$ = this.store.paginationState;
  readonly games$ = this.store.games;

  ngOnInit(): void {
    this.store.getGames({...this.paginationState$()})
  }

  updatePageNumber(pageNumber: number): void {
    this.store.getGames({pageSize: this.paginationState$().pageSize, pageNumber: pageNumber});
  }

  updatePageSize(pageSize: number): void {
    this.store.getGames({pageSize: pageSize, pageNumber: this.paginationState$().pageNumber})
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

  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;
}
