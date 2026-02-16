import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CategoryDto} from '../../models/category.dto';
import {TableModule} from 'primeng/table';
import {ConfirmationService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryUpdateComponent} from '../category-update/category-update.component';
import {CategoryStore} from '../../store/category-store';
import {ListItemComponent} from '../../../../shared/components/list-item/list-item.component';
import {Button} from 'primeng/button';
import {CategoryService} from '../../services/category.service';
import {PaginatorComponent} from '../../../../shared/components/paginator/paginator.component';
import {PaginationConfig} from '../../../../shared/models/pagination-config';
import {IndexItemList} from '../../../../shared/models/index-item-list';

@Component({
  selector: 'app-category-list',
  imports: [
    TableModule,
    ListItemComponent,
    Button,
    PaginatorComponent,

  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
  export class CategoryListComponent implements OnInit{
  private confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  private categoriesService = inject(CategoryService);
  store = inject(CategoryStore);
  readonly indexCategories$ = signal<IndexItemList | null>(null)
  readonly paginationState$ = signal<PaginationConfig>({
    pageSize: 5,
    pageNumber: 1,
    amountPagesList: []
  })
  readonly categories$ = signal<CategoryDto[]>([]);



  ngOnInit(): void {
    this.categoriesService.getUserCategories({pageSize: this.paginationState$().pageSize, pageNumber: this.paginationState$().pageNumber})
      .subscribe(x => {
        this.paginationState$.set({
          pageSize: x.pageSize,
          pageNumber: x.pageNumber,
          amountPagesList: x.amountPagesList
        })
        this.categories$.set(x.results);
      })
  }

  updatePageNumber(pageNumber: number): void {
    this.categoriesService.getUserCategories({pageSize: this.paginationState$().pageSize, pageNumber: pageNumber})
      .subscribe(x => {
        this.paginationState$.set({
          pageSize: x.pageSize,
          pageNumber: x.pageNumber,
          amountPagesList: x.amountPagesList
        })
        this.categories$.set(x.results);
      })
  }

  updatePageSize(pageSize: number): void {
    this.categoriesService.getUserCategories({pageSize: pageSize, pageNumber: this.paginationState$().pageNumber})
      .subscribe(x => {
        this.paginationState$.set({
          pageSize: x.pageSize,
          pageNumber: x.pageNumber,
          amountPagesList: x.amountPagesList
        })
        this.categories$.set(x.results);
      })
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
