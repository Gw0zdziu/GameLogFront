import {Component, effect, inject, input, model, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Message} from 'primeng/message';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {Textarea} from 'primeng/textarea';
import {CategoryBaseDto} from '../../models/category-base.dto';

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    Message,
    InputText,
    ButtonDirective,
    ButtonLabel,
    Textarea
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent<TData extends CategoryBaseDto> {
  private formBuilder = inject(FormBuilder);
  newCategoryForm = this.formBuilder.group({
    categoryName: ['', {
      validators: [Validators.required],
      updateOn: 'blur'
    }],
    description: ['', {
      validators: [],
      updateOn: 'blur'
    }]
  })
  isSubmit = input.required();
  onSubmit = output();
  category = model<TData | null>(null);

  constructor() {
    effect(() => {
      if (this.category()) {
        this.newCategoryForm.setValue({
          categoryName: this.category()?.categoryName as string,
          description: this.category()?.description as string,
        })
      }
    });
  }

  submitForm(){
    const newCategory = this.newCategoryForm.value as TData;
    this.category.set(newCategory);
    this.onSubmit.emit();
  }

}
