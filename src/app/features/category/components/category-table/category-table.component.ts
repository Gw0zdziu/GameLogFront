import {Component, inject, model, OnInit, signal} from '@angular/core';
import {CategoryDto} from "../../models/category.dto";
import {TableModule} from 'primeng/table';
import {CategoryService} from '../../services/category.service';
import {ToastService} from '../../../../core/services/toast/toast.service';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryUpdateComponent} from '../category-update/category-update.component';
import {TableComponent} from '../../../../shared/components/table/table/table.component';
import {Column} from '../../../../shared/models/column';
import {FormatDateDistancePipe} from '../../../../core/pipes/format-date-distance.pipe';

@Component({
  selector: 'app-category-table',
  imports: [
    TableModule,
    TableComponent,

  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css',
  providers: [FormatDateDistancePipe],
})
export class CategoryTableComponent implements OnInit{
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private formatDateDistancePipe = inject(FormatDateDistancePipe);
  categories = model<CategoryDto[]>([])
  ref: DynamicDialogRef | undefined;
  columns = signal<Column<CategoryDto>[]>([]);


  ngOnInit(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (response) => {
        const categories = response.map(x => {
          return {
            ...x,
            createdDate: this.formatDateDistancePipe.transform(x.createdDate as Date),
            updatedDate: this.formatDateDistancePipe.transform(x.updatedDate as Date),
          };
        })
        this.categories.set(categories);
      },
    });
    this.columns.set([
      {field: 'categoryName', header: 'Nazwa kategorii'},
      {field: 'description', header: 'Opis'},
      {field: 'createdDate', header: 'Data utworzenia'},
      {field: 'updatedDate', header: 'Data aktualizacji'},
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
        this.categories.update(categories => {
           const categoryIndex = categories.findIndex(x => x.categoryId === value.categoryId);
           categories[categoryIndex] = {
             ...value,
             createdDate: this.formatDateDistancePipe.transform(value.createdDate as Date),
             updatedDate: this.formatDateDistancePipe.transform(value.updatedDate as Date),
           }
          return categories
        });
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
        this.categoryService.deleteCategory(categoryId).subscribe({
          next: () => {
            this.categories.update(value => {
              return value.filter(x => x.categoryId !== categoryId)
            });
            this.toastService.showSuccess('Pomyślnie usunięto kategorię')
          },
          error: () => {

          },
          complete: () => {}
        })
      }
    })
  }


}
