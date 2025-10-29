import {Component, inject, signal} from '@angular/core';
import {CategoryService} from './services/category.service';
import {TableModule} from 'primeng/table';
import {CategoryDto} from './models/category.dto';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryTableComponent} from './components/category-table/category-table.component';
import {CategoryAddComponent} from './components/category-add/category-add.component';
import {FormatDateDistancePipe} from '../../core/pipes/format-date-distance.pipe';

@Component({
  selector: 'app-category',
  imports: [
    TableModule,
    ButtonDirective,
    ButtonLabel,
    CategoryTableComponent
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  providers: [DialogService, FormatDateDistancePipe],
})
export class CategoryComponent{
  private categoryService = inject(CategoryService);
  private dialogService = inject(DialogService);
  private formatDateDistancePipe = inject(FormatDateDistancePipe);
  categories = signal<CategoryDto[]>([]);
  ref: DynamicDialogRef | undefined;

  openAddCategoryDialog(){
    this.ref = this.dialogService.open(CategoryAddComponent, {
      header: 'Dodaj nową kategorię',
      modal: true,
    })
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) return;
      this.getCategories();
    });

  }

  private getCategories() {
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
  }


}
