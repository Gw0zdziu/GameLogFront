import { ChangeDetectionStrategy, Component, effect, inject, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective, ButtonLabel } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { CategoryBaseDto } from '../../models/category-base.dto';
import { CategoryStore } from '../../store/category-store';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFormComponent<T extends CategoryBaseDto> {
  private formBuilder = inject(FormBuilder);
  store = inject(CategoryStore)
  newCategoryForm = this.formBuilder.group({
    categoryName: ['', {
      validators: [Validators.required, Validators.minLength(10)],
      updateOn: 'blur'
    }],
    description: ['', {
      validators: [],
      updateOn: 'blur'
    }]
  })
  readonly submitEmitter = output();
  readonly category = model<T | null>(null);

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

  submitForm(): void{
    const newCategory = this.newCategoryForm.value as T;
    this.category.set(newCategory);
    this.submitEmitter.emit();
  }

}
