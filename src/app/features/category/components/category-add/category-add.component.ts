import {Component, inject, signal} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryPostDto} from '../../models/category-post.dto';
import {CategoryFormComponent} from '../category-form/category-form.component';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToastService} from '../../../../core/services/toast/toast.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-category-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CategoryFormComponent,
  ],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css'
})
export class CategoryAddComponent {
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private dynamicDialogRef = inject(DynamicDialogRef);
  isSubmit = signal(false);
  newCategory = signal<CategoryPostDto | null>(null);




  postNewCategory(){
    this.isSubmit.set(true);
    const newCategory: CategoryPostDto = this.newCategory() as CategoryPostDto;
    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.isSubmit.set(false);
        this.dynamicDialogRef.close(true);
        this.toastService.showSuccess('Utworzono nową kategorię');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmit.set(false);
        console.log(error)
        this.toastService.showError(error.error);

      },
      complete: () => {
        this.isSubmit.set(false);
      }
    })
  }
}
