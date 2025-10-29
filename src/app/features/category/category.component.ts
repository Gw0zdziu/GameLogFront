import {Component, inject} from '@angular/core';
import {CategoryService} from './services/category.service';
import {TableModule} from 'primeng/table';
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
  ref: DynamicDialogRef | undefined;

  openAddCategoryDialog(){
    this.ref = this.dialogService.open(CategoryAddComponent, {
      header: 'Dodaj nową kategorię',
      modal: true,
    })
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) return;
    });

  }
}
