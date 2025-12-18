import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CategoryDto} from '../../models/category.dto';
import {TableModule} from 'primeng/table';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryUpdateComponent} from '../category-update/category-update.component';
import {TableComponent} from '../../../../shared/components/table/table/table.component';
import {Column} from '../../../../shared/models/column';
import {CategoryStore} from '../../store/category-store';

@Component({
  selector: 'app-category-table',
  imports: [
    TableModule,
    TableComponent,
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryTableComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  store = inject(CategoryStore);
  readonly columns = signal<Column<CategoryDto>[]>([]);



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
        header: $localize`Data utworzenia`,
      },
      {
        field: 'updatedDate',
        header: $localize`Data aktualizacji`,
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
