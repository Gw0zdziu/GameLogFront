import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { CategoryDto } from '../models/category.dto';
import { CategoryPostDto } from '../models/category-post.dto';
import { CategoryPutDto } from '../models/category-put.dto';
import { PaginatedResults } from '../../../shared/models/paginated-results';
import { PaginatedQuery } from '../../../shared/models/paginated-query';
import { IS_AUTH_REQUIRED } from '../../../core/tokens/tokens';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const category: CategoryDto = {
    categoryId: '1',
    categoryName: 'Action & Adventure',
    description: 'Fast-paced games with combat and exploration.',
    createdDate: new Date('2023-08-15T10:30:00.000Z'),
    updatedDate: new Date('2024-11-28T14:45:22.000Z'),
    createdBy: 'john.doe@example.com',
    updatedBy: 'admin@example.com',
    gamesCount: 47,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserCategories()', () => {
    const query: PaginatedQuery = { pageNumber: 1, pageSize: 10 };
    const paginatedResult: PaginatedResults<CategoryDto> = {
      results: [category],
      totalAmount: 1,
      pageNumber: 1,
      pageSize: 10,
      firstItemIndexList: 0,
      lastItemIndexList: 0,
      amountPagesList: [1],
    };

    it('should make GET request with pagination params and return paginated categories', () => {
      service.getUserCategories(query).subscribe(result => {
        expect(result).toEqual(paginatedResult);
      });

      const req = httpMock.expectOne(r =>
        r.url === 'https://localhost:8080/api/category/get-user-categories' &&
        r.params.get('pageNumber') === '1' &&
        r.params.get('pageSize') === '10'
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(paginatedResult);
    });

    it('should set IS_AUTH_REQUIRED context token', () => {
      service.getUserCategories(query).subscribe();

      const req = httpMock.expectOne(r =>
        r.url === 'https://localhost:8080/api/category/get-user-categories'
      );
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(paginatedResult);
    });
  });

  describe('getCategoriesByUserId()', () => {
    it('should make GET request and return all categories for a given user', () => {
      service.getCategoriesByUserId('user-1').subscribe(result => {
        expect(result).toEqual([category]);
      });

      const req = httpMock.expectOne(
        'https://localhost:8080/api/category/get-categories-by-userId/user-1'
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush([category]);
    });
  });

  describe('getCategory()', () => {
    it('should make GET request and return a single category', () => {
      service.getCategory('1').subscribe(result => {
        expect(result).toEqual(category);
      });

      const req = httpMock.expectOne('https://localhost:8080/api/category/get-category/1');
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(category);
    });
  });

  describe('createCategory()', () => {
    it('should make POST request with body and return the created category', () => {
      const categoryPostDto: CategoryPostDto = {
        categoryName: category.categoryName,
        description: category.description,
      };

      service.createCategory(categoryPostDto).subscribe(result => {
        expect(result).toEqual(category);
      });

      const req = httpMock.expectOne('https://localhost:8080/api/category/create-category');
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.body).toEqual(categoryPostDto);
      req.flush(category);
    });
  });

  describe('deleteCategory()', () => {
    it('should make DELETE request and complete without a body', () => {
      service.deleteCategory('1').subscribe(result => {
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne('https://localhost:8080/api/category/delete/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBe(true);
      req.flush(null);
    });
  });

  describe('updateCategory()', () => {
    it('should make PUT request with body and return the updated category', () => {
      const categoryPutDto: CategoryPutDto = {
        categoryName: 'Updated Name',
        description: 'Updated description.',
      };

      service.updateCategory(categoryPutDto, '1').subscribe(result => {
        expect(result).toEqual(category);
      });

      const req = httpMock.expectOne('https://localhost:8080/api/category/update/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.body).toEqual(categoryPutDto);
      req.flush(category);
    });
  });
});