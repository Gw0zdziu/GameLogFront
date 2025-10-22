import {Component, inject, OnInit, signal} from '@angular/core';
import {CategoryFormComponent} from '../category-form/category-form.component';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryService} from '../../services/category.service';
import {CategoryDto} from '../../models/category.dto';
import {CategoryPutDto} from '../../models/category-put.dto';

@Component({
  selector: 'app-category-update',
  imports: [
    CategoryFormComponent,
  ],
  templateUrl: './category-update.component.html',
  styleUrl: './category-update.component.css'
})
export class CategoryUpdateComponent implements OnInit {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);
  private categoryService = inject(CategoryService);
  instance: DynamicDialogComponent | undefined;
  categoryId: string;
  isSubmit = signal(false);
  category = signal<CategoryDto | null>(null);
  updatedCategory = signal<CategoryPutDto | null>(null);

  constructor() {
    this.instance = this.dialogService.getInstance(this.dynamicDialogRef);
  }

  ngOnInit() {
    this.categoryId = this.instance?.data;
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: value => {
        this.updatedCategory.set(value);
        this.category.set(value)
      }
    })
  }


  submitForm(){
    const updatedCategory = this.updatedCategory() as CategoryPutDto;
    this.categoryService.updateCategory(updatedCategory, this.categoryId).subscribe({
      next: () => {
        this.category.update(value => {
          const currentDate = new Date();
          const newCategory: CategoryDto = {
            categoryId: value?.categoryId as string,
            categoryName: updatedCategory.categoryName,
            description: updatedCategory.description,
            updatedBy: value?.updatedBy as string,
            updatedDate: currentDate,
            createdBy: value?.createdBy as string,
            createdDate: value?.createdDate as Date,
          }
          return newCategory
        })
        this.dynamicDialogRef.close(this.category());
      },
      complete: () => {
        this.isSubmit = signal(false);
      }
    })
  }

}
