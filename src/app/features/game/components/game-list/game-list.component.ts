import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ButtonDirective} from 'primeng/button';
import {ListItemComponent} from '../../../../shared/components/list-item/list-item.component';
import {PaginatorComponent} from '../../../../shared/components/paginator/paginator.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faPencil, faSpinner, faTrash} from "@fortawesome/free-solid-svg-icons";
import {GameUpdateComponent} from '../game-update/game-update.component';
import {FormatDatePipe} from '../../../../shared/pipes/format-date.pipe';
import {PaginatedQuery} from '../../../../shared/models/paginated-query';

@Component({
  selector: 'app-game-list',
  imports: [
    ListItemComponent,
    FormatDatePipe,
    PaginatorComponent,
    ButtonDirective,
    FaIconComponent,
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
  faTrash = faTrash;
  faPencil = faPencil;
  faSpinner = faSpinner;

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
        this.store.deleteGame({
          gameId: gameId,
          onSuccess: () => {
            let paginatedQuery: PaginatedQuery;
            if (this.store.games().length === 0 && this.store.paginationState.amountPagesList().length > 1){
              paginatedQuery = {
                pageSize: this.store.paginationState.pageSize(),
                pageNumber: this.store.paginationState.pageNumber() - 1
              }
            } else {
              paginatedQuery = {
                pageNumber: this.store.paginationState.pageNumber(),
                pageSize: this.store.paginationState.pageSize(),
              }
            }
            this.store.getGames(paginatedQuery);
          }
        });
      }
    })
  }



  updateGame(gameId: string): void{
    this.ref = this.dialogService.open(GameUpdateComponent,{
      modal: true,
      data: gameId,
      header: $localize`Zaktualizuj grę`,
      dismissableMask: true,
      closable: true,
      focusOnShow: false,
    })
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) {return;}
      this.store.getGames(
        {
        pageNumber: this.paginationState$().pageNumber,
        pageSize: this.paginationState$().pageSize
        });
    });
  }

}
