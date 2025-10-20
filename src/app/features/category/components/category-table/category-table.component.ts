import {Component, inject, model} from '@angular/core';
import {CategoryDto} from "../../models/category.dto";
import {FormatDateDistancePipe} from '../../../../core/pipes/format-date-distance.pipe';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {CategoryService} from '../../services/category.service';
import {ToastService} from '../../../../core/services/toast/toast.service';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-category-table',
  imports: [
    FormatDateDistancePipe,
    TableModule,
    Button
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css'
})
export class CategoryTableComponent {
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  categories = model<CategoryDto[]>([])


  deleteCategory(categoryId: any) {
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
