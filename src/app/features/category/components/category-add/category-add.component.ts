import {Component, inject, signal} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {CategoryPostDto} from '../../models/category-post.dto';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-category-add',
  imports: [
    FormsModule,
    InputText,
    Message,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonLabel,
    Textarea
  ],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css'
})
export class CategoryAddComponent {
  private categoryService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);
  private dynamicDialogRef = inject(DynamicDialogRef);
  isSubmit = signal(false);

  newCategoryForm = this.formBuilder.group({
    categoryName: ['', {
      validators: [Validators.required],
      updateOn: 'blur'
    }],
    description: ['', {
      validators: [Validators.required],
      updateOn: 'blur'
    }]
  })


  postNewCategory(){
    this.isSubmit.set(true);
    const newCategory = this.newCategoryForm.value as CategoryPostDto;
    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.dynamicDialogRef.close(this.isSubmit());

      },
      error: () => {
        this.isSubmit.set(false);
      },
      complete: () => {
        this.isSubmit.set(false);
      }
    })
  }
}
