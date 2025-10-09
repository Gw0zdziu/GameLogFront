import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext} from '@angular/common/http';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {Observable} from 'rxjs';
import {CategoryDto} from '../models/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/category`;
  private http = inject(HttpClient);

  getUserCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.apiUrl}/user-categories`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    });
  }
}
