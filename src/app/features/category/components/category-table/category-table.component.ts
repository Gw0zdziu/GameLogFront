import {Component, inject, OnInit, signal} from '@angular/core';
import {CategoryDto} from "../../models/category.dto";
import {TableModule} from 'primeng/table';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryUpdateComponent} from '../category-update/category-update.component';
import {TableComponent} from '../../../../shared/components/table/table/table.component';
import {Column} from '../../../../shared/models/column';
import {FormatDateDistancePipe} from '../../../../core/pipes/format-date-distance.pipe';
import {CategoryStore} from '../../store/category-store';

@Component({
  selector: 'app-category-table',
  imports: [
    TableModule,
    TableComponent,

  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css',
  providers: [FormatDateDistancePipe, CategoryStore],
})
export class CategoryTableComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  public store = inject(CategoryStore);
  columns = signal<Column<CategoryDto>[]>([]);



  ngOnInit(): void {
    this.store.getCategories();
    this.columns.set([
      {
        field: 'categoryName',
        header: 'Nazwa kategorii',
      },
      {
        field: 'description',
        header: 'Opis',
      },
      {
        field: 'createdDate',
        header: 'Data utworzenia',
      },
      {
        field: 'updatedDate',
        header: 'Data aktualizacji',
      },
      {
        header: 'Akcje',
        columnType: 'action',
        actions: [
          {
            toolTip: 'Usuń',
            icon: 'pi pi-trash',
            label: 'Usuń',
            actionType: 'delete',
            action: (item: CategoryDto) => {
              this.deleteCategory(item.categoryId)
            }
          },
          {
            toolTip: 'Edytuj',
            icon: 'pi pi-pencil',
            label: 'Edytuj',
            actionType: 'update',
            action: (item: CategoryDto) => {
              this.updateCategory(item.categoryId)
            }
          }
        ]
      }
    ])
  }

  updateCategory(categoryId: string) {
    this.ref = this.dialogService.open(CategoryUpdateComponent, {
      modal: true,
      header: 'Zaktualizuj grę',
      data: categoryId,
    })
    this.ref.onClose.subscribe({
      next: (value: CategoryDto) => {
        if (!value) return;
      }
    })
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Czy chcesz usunąć kategorię?',
      header: 'Usuwanie kategorii',
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
        this.store.deleteCategory(categoryId);
      }
    })
  }


}
