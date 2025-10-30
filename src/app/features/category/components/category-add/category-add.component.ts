import {Component, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryPostDto} from '../../models/category-post.dto';
import {CategoryFormComponent} from '../category-form/category-form.component';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryStore} from '../../store/category-store';

@Component({
  selector: 'app-category-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CategoryFormComponent,
  ],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css',
  providers: [CategoryStore],
})
export class CategoryAddComponent {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private store = inject(CategoryStore);
  newCategory = signal<CategoryPostDto | null>(null);


  postNewCategory(){
    const newCategory: CategoryPostDto = this.newCategory() as CategoryPostDto;
    this.store.addCategory({
      newCategory: newCategory,
      onSuccess: () => {
        this.dynamicDialogRef.close(true);
      }
    });
  }
}
