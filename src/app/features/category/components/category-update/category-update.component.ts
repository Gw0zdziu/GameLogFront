import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from '../../services/category.service';
import { CategoryPutDto } from '../../models/category-put.dto';
import { CategoryStore } from '../../store/category-store';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-category-update',
  imports: [
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText,
    Message,
    ReactiveFormsModule,
    Textarea,
  ],
  templateUrl: './category-update.component.html',
  styleUrl: './category-update.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryUpdateComponent implements OnInit {
  private dynamicDialogRef = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);
  private categoryService = inject(CategoryService);
  store = inject(CategoryStore);
  private formBuilder = inject(FormBuilder);
  instance: DynamicDialogComponent | undefined;
  categoryId: string;
  readonly updatedCategory = signal<CategoryPutDto | null>(null);
  updatedCategoryForm = this.formBuilder.group({
    categoryName: ['', {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'blur'
    }],
    description: ['', {
      validators: [],
      updateOn: 'blur'
    }]
  })

  constructor() {
    this.instance = this.dialogService.getInstance(this.dynamicDialogRef);
  }

  ngOnInit(): void {
    this.categoryId = this.instance?.data;
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: value => {
        this.updatedCategoryForm.setValue({categoryName: value.categoryName, description: value.description});
      }
    })
  }


  submitForm(): void{
    const updatedCategory = this.updatedCategoryForm.getRawValue() as CategoryPutDto;
    this.store.updateCategory({
      category: updatedCategory,
      categoryId: this.categoryId,
      onSuccess: () => {
        this.dynamicDialogRef.close();
      }
    })
  }

}
