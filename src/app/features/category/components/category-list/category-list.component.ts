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
import {Subject} from 'rxjs';
import {AsyncPipe} from '@angular/common';

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
  store = inject(CategoryStore);
  readonly paginationState$ = this.store.paginationState



  ngOnInit(): void {
    this.store.getCategories({...this.paginationState$()});
    /*this.categoriesService.getUserCategories({pageSize: this.paginationState$().pageSize, pageNumber: this.paginationState$().pageNumber})
      .subscribe(x => {
        this.paginationState$.set({
          pageSize: x.pageSize,
          pageNumber: x.pageNumber,
          amountPagesList: x.amountPagesList
        })
        this.categories$.set(x.results)
      })*/
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
