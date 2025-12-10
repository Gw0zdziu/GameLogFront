import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from '../../services/category.service';
import { CategoryPutDto } from '../../models/category-put.dto';
import { CategoryStore } from '../../store/category-store';

@Component({
  selector: 'app-category-update',
  imports: [
    CategoryFormComponent,
  ],
  templateUrl: './category-update.component.html',
  styleUrl: './category-update.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryUpdateComponent implements OnInit {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);
  private categoryService = inject(CategoryService);
  private store = inject(CategoryStore);
  instance: DynamicDialogComponent | undefined;
  categoryId: string;
  readonly updatedCategory = signal<CategoryPutDto | null>(null);

  constructor() {
    this.instance = this.dialogService.getInstance(this.dynamicDialogRef);
  }

  ngOnInit(): void {
    this.categoryId = this.instance?.data;
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: value => {
        this.updatedCategory.set(value);
      }
    })
  }


  submitForm(): void{
    const updatedCategory = this.updatedCategory() as CategoryPutDto;
    this.store.updateCategory({
      category: updatedCategory,
      categoryId: this.categoryId,
      onSuccess: () => {
        this.dynamicDialogRef.close();
      }
    })
  }

}
