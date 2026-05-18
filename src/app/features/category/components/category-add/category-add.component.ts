import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CategoryPostDto } from '../../models/category-post.dto';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryStore } from '../../store/category-store';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-category-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonLabel,
    InputText,
    Message,
    Textarea,
  ],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryAddComponent {
  private dynamicDialogRef = inject(DynamicDialogRef);
  store = inject(CategoryStore)
  private formBuilder = inject(FormBuilder);
  newCategoryForm = this.formBuilder.group({
    categoryName: ['', {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'blur'
    }],
    description: ['', {
      validators: [],
      updateOn: 'blur'
    }]
  })


  submitForm(): void{
    const newCategory: CategoryPostDto = this.newCategoryForm.getRawValue() as CategoryPostDto;
    this.store.addCategory({
      newCategory: newCategory,
      onSuccess: () => {
        this.dynamicDialogRef.close(true);
        this.store.getCategories(this.store.paginationState())
      }
    });
  }
}
