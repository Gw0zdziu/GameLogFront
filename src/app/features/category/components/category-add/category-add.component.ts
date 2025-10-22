import {Component, inject, signal} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryPostDto} from '../../models/category-post.dto';
import {CategoryFormComponent} from '../category-form/category-form.component';

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
  isSubmit = signal(false);
  newCategory = signal<CategoryPostDto | null>(null);




  postNewCategory(){
    this.isSubmit.set(true);
    const newCategory: CategoryPostDto = this.newCategory() as CategoryPostDto;
    this.categoryService.createCategory(newCategory).subscribe({
      complete: () => {
        this.isSubmit.set(false);
      }
    })
  }
}
