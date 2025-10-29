import {computed, inject, Injectable, signal} from '@angular/core';
import {CategoryDto} from '../models/category.dto';
import {FormatDateDistancePipe} from '../../../core/pipes/format-date-distance.pipe';

@Injectable({
  providedIn: 'root',
})
export class CategoryStoreService {
  private categories = signal<CategoryDto[]>([]);
  categories$ = computed(() => {
    return this.categories().map(x => {
      return {
        ...x,
        createdDate: this.formatDateDistancePipe.transform(x.createdDate as Date),
        updatedDate: this.formatDateDistancePipe.transform(x.updatedDate as Date)
      }
    })
  })
  private formatDateDistancePipe = inject(FormatDateDistancePipe);

  addCategory(category: CategoryDto){
    this.categories.update(prev => [...prev, category]);
  }

  removeCategory(categoryId: string){
    this.categories.update(prev =>
      prev.filter(category => category.categoryId !== categoryId));
  }

  updateCategory(category: CategoryDto){
    this.categories.update(prev =>
      prev.map(prevCategory => prevCategory.categoryId === category.categoryId ? category : prevCategory));
  }

  setCategories(categories: CategoryDto[]){
    this.categories.set(categories);
  }
}
