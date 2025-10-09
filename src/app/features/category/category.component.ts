import {Component, inject, OnInit, signal} from '@angular/core';
import {CategoryService} from './services/category.service';
import {TableModule} from 'primeng/table';
import {CategoryDto} from './models/category.dto';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryTableComponent} from './components/category-table/category-table.component';

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
  categories = signal<CategoryDto[]>([]);
  ref: DynamicDialogRef | undefined;


  ngOnInit(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (response) => {
        this.categories.set(response);
      },
    });
  }



}
