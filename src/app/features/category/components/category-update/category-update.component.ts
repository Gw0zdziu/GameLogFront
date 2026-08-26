import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryService} from '../../services/category.service';
import {CategoryPutDto} from '../../models/category-put.dto';
import {CategoryStore} from '../../store/category-store';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-category-update',
  imports: [
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Textarea,
    Message,
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
  instance: DynamicDialogComponent | undefined;
  categoryId: string;
  readonly updatedCategory = signal<CategoryPutDto>( {
    categoryName: '',
    description: ''
  });


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
    this.store.updateCategory({
      category: this.updatedCategory(),
      categoryId: this.categoryId,
      onSuccess: () => {
        this.dynamicDialogRef.close();
      }
    })
  }

}
