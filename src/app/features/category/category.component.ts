import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryListComponent} from './components/category-list/category-list.component';
import {CategoryAddComponent} from './components/category-add/category-add.component';

@Component({
  selector: 'app-category',
  imports: [TableModule, ButtonDirective, ButtonLabel, CategoryListComponent],
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
      header: $localize`Dodaj nową kategorię`,
      modal: true,
    });
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) {return;}
    });
  }
}
