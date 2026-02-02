import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CategoryDto} from '../../models/category.dto';
import {TableModule} from 'primeng/table';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryUpdateComponent} from '../category-update/category-update.component';
import {Column} from '../../../../shared/models/column';
import {CategoryStore} from '../../store/category-store';
import {ListItemComponent} from '../../../../shared/components/list-item/list-item.component';
import {Button} from 'primeng/button';
import { FormatDatePipe} from '../../../../core/pipes/format-date.pipe';

@Component({
  selector: 'app-category-list',
  imports: [
    TableModule,
    ListItemComponent,
    Button,
    FormatDatePipe,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
  export class CategoryListComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  store = inject(CategoryStore);
  readonly columns = signal<Column<CategoryDto>[]>([]);
  emptyMessage = $localize`Brak kategorii`;



  ngOnInit(): void {
    this.store.getCategories();
    this.columns.set([
      {
        field: 'categoryName',
        header: $localize`Nazwa kategorii`,
      },
      {
        field: 'description',
        header: $localize`Opis`,
      },
      {
        field: 'gamesCount',
        header: $localize`Liczba gier`,
      },
      {
        field: 'createdDate',
        header: $localize`Utworzono`,
      },
      {
        field: 'updatedDate',
        header: $localize`Zaktualizowano`,
      },
      {
        header: $localize`Akcje`,
        columnType: 'action',
        actions: [
          {
            toolTip: $localize`Usuń`,
            icon: 'pi pi-trash',
            label: $localize`Usuń`,
            actionType: 'delete',
            action: (item: CategoryDto): void => {
              this.deleteCategory(item.categoryId)
            }
          },
          {
            toolTip: $localize`Edytuj`,
            icon: 'pi pi-pencil',
            label: $localize`Edytuj`,
            actionType: 'update',
            action: (item: CategoryDto): void => {
              this.updateCategory(item.categoryId)
            }
          }
        ]
      }
    ])
  }

  updateCategory(categoryId: string): void {
    this.ref = this.dialogService.open(CategoryUpdateComponent, {
      modal: true,
      header: $localize`Zaktualizuj kategorię`,
      data: categoryId,
    })
    this.ref.onClose.subscribe({
      next: (value: CategoryDto) => {
        if (!value) {return;}
      }
    })
  }

  deleteCategory(categoryId: string): void {
    this.confirmationService.confirm({
      message: $localize`Czy chcesz usunąć kategorię?`,
      header: $localize`Usuwanie kategorii`,
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
        this.store.deleteCategory(categoryId);
      }
    })
  }


}
