import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CategoryDto} from '../../models/category.dto';
import {TableModule} from 'primeng/table';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryUpdateComponent} from '../category-update/category-update.component';
import {CategoryStore} from '../../store/category-store';
import {ListItemComponent} from '../../../../shared/components/list-item/list-item.component';
import {ButtonDirective} from 'primeng/button';
import {PaginatorComponent} from '../../../../shared/components/paginator/paginator.component';
import {faPencil, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-category-list',
  imports: [
    TableModule,
    ListItemComponent,
    PaginatorComponent,
    ButtonDirective,
    FaIconComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
  export class CategoryListComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  store = inject(CategoryStore);
  readonly paginationState$ = this.store.paginationState;
  readonly categories$ = this.store.categories;
  faPencil = faPencil;
  faTrash = faTrash;

  ngOnInit(): void {
    this.store.getCategories({...this.paginationState$()});
  }

  updatePageNumber(pageNumber: number): void {
    this.store.getCategories({
      pageNumber: pageNumber,
      pageSize: this.paginationState$().pageSize
    });
  }

  updatePageSize(pageSize: number): void {
    this.store.getCategories({
      pageNumber: this.paginationState$().pageNumber,
      pageSize: pageSize
    });
  }


  updateCategory(categoryId: string): void {
    this.ref = this.dialogService.open(CategoryUpdateComponent, {
      modal: true,
      header: $localize`Zaktualizuj kategorię`,
      data: categoryId,
    })
    this.ref.onClose.subscribe({
      next: (value: CategoryDto) => {
        if (!value) {return;}
      }
    })
  }

  deleteCategory(categoryId: string): void {
    this.confirmationService.confirm({
      message: $localize`Czy chcesz usunąć kategorię?`,
      header: $localize`Usuwanie kategorii`,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: $localize`Anuluj`,
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: $localize`Usuń`,
        severity: 'danger',
      },
      accept: () => {
        this.store.deleteCategory(categoryId);
      }
    })
  }

}
