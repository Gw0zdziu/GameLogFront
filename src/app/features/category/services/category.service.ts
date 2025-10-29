import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext} from '@angular/common/http';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {Observable, tap} from 'rxjs';
import {CategoryDto} from '../models/category.dto';
import {CategoryPostDto} from '../models/category-post.dto';
import {CategoryPutDto} from '../models/category-put.dto';
import {CategoryStoreService} from '../store/category-store.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;
  private http = inject(HttpClient);
  private categoryStoreService = inject(CategoryStoreService);

  getUserCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.apiUrl}/get-user-categories`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    }).pipe(
      tap(x => {
        this.categoryStoreService.setCategories(x);
      })
    );
  }

  getCategory(categoryId: string): Observable<CategoryDto>{
    return this.http.get<CategoryDto>(`${this.apiUrl}/get-category/${categoryId}`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
  }

  createCategory(categoryPost: CategoryPostDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${this.apiUrl}/create-category`, categoryPost, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
      .pipe(
        tap(category => {
          this.categoryStoreService.addCategory(category);
        })
      )
  }

  deleteCategory(categoryId: string){
    return this.http.delete<void>(`${this.apiUrl}/delete/${categoryId}`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
      .pipe(
        tap(() => {
          this.categoryStoreService.removeCategory(categoryId);
        })
      )
  }

  updateCategory(categoryPut: CategoryPutDto, categoryId: string): Observable<CategoryDto>{
    return this.http.put<CategoryDto>(`${this.apiUrl}/update/${categoryId}`, categoryPut, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
      .pipe(
        tap(category => {
          this.categoryStoreService.updateCategory(category);
        })
      )
  }


}
