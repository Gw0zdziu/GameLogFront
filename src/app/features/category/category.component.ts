import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { CategoryAddComponent } from './components/category-add/category-add.component';

@Component({
  selector: 'app-category',
  imports: [TableModule, ButtonDirective, ButtonLabel, CategoryTableComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  private dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

  openAddCategoryDialog(): void {
    this.ref = this.dialogService.open(CategoryAddComponent, {
      header: 'Dodaj nową kategorię',
      modal: true,
    });
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) {return;}
    });
  }
}
