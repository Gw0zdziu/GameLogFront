import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {CategoryPostDto} from '../../models/category-post.dto';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryStore} from '../../store/category-store';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {Message} from 'primeng/message';


@Component({
  selector: 'app-category-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonLabel,
    InputText,
    Textarea,
    FaIconComponent,
    Message,
  ],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryAddComponent {
  private dynamicDialogRef = inject(DynamicDialogRef);
  store = inject(CategoryStore)
  faSpinner = faSpinner;
  
  submitForm(newCategoryForm: NgForm): void{
    const newCategory: CategoryPostDto = newCategoryForm.value as CategoryPostDto;
    this.store.addCategory({
      newCategory: newCategory,
      onSuccess: () => {
        this.dynamicDialogRef.close(true);
        this.store.getCategories(this.store.paginationState())
      }
    });
  }
}
