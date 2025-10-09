import {Component, inject, OnInit, signal} from '@angular/core';
import {CategoryService} from './services/category.service';
import {TableModule} from 'primeng/table';
import {CategoryDto} from './models/category.dto';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryTableComponent} from './components/category-table/category-table.component';
import {CategoryAddComponent} from './components/category-add/category-add.component';
import {ToastService} from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-category',
  imports: [
    TableModule,
    ButtonDirective,
    ButtonLabel,
    CategoryTableComponent
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  providers: [DialogService],
})
export class CategoryComponent implements OnInit{
  private categoryService = inject(CategoryService);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);
  categories = signal<CategoryDto[]>([]);

  ref: DynamicDialogRef | undefined;


  ngOnInit(): void {
    this.getCategories();
  }


  private getCategories() {
    this.categoryService.getUserCategories().subscribe({
      next: (response) => {
        this.categories.set(response);
      },
    });
  }

  openAddCategoryDialog(){
    this.ref = this.dialogService.open(CategoryAddComponent, {
      header: 'Dodaj nową kategorię',
      modal: true,
    })
    this.ref.onClose.subscribe((x: boolean) => {
      if (!x) return;
      this.toastService.showSuccess('Utworzono nową kategorię');
      this.getCategories();
    });

  }



}
