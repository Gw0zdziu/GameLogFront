import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryDto } from '../models/category.dto';
import { CategoryPostDto } from '../models/category-post.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const category: CategoryDto = {
    categoryId: '1',
    categoryName: 'Action & Adventure',
    description: 'Fast-paced games with combat and exploration.',
    createdDate: '2023-08-15T10:30:00.000Z',
    updatedDate: '2024-11-28T14:45:22.000Z',
    createdBy: 'john.doe@example.com',
    updatedBy: 'admin@example.com',
    gamesCount: 47,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserCategories()', () => {
    it('should make GET request and return categories', () => {
      service.getUserCategories().subscribe(categories => {
        expect(categories).toEqual([category]);
      })
      const req = httpMock.expectOne('https://localhost:8080/api/category/get-user-categories');
      expect(req.request.method).toEqual('GET');
      req.flush([category]);
    })
  })

  describe('getCategory()', () => {
    it('should make GET request and return category', () => {
      service.getCategory('1').subscribe(category => {
        expect(category).toEqual(category);
      })
      const req = httpMock.expectOne('https://localhost:8080/api/category/get-category/1');
      expect(req.request.method).toEqual('GET');
    })
  })

  describe('createCategory()', () => {
    it('should post new category and return new category', () => {
      const categoryPostDto: CategoryPostDto = {
        categoryName: category.categoryName,
        description: category.description,
      }
      service.createCategory(categoryPostDto).subscribe(x => {
        expect(x).toEqual(category);
      })
      const req = httpMock.expectOne('https://localhost:8080/api/category/create-category');
      expect(req.request.method).toEqual('POST');
      req.flush(category);
    });
  })

  describe('deleteCategory()', () => {
    it('should delete category and return void', () => {
      service.deleteCategory('1').subscribe(x => {
        expect(x).toBeUndefined();
      })
      const req = httpMock.expectOne('https://localhost:8080/api/category/delete/1');
      expect(req.request.method).toEqual('DELETE');
    });
  })

  describe('updateCategory()', () => {
    it('should update return updated category', () => {
      service.updateCategory(category, '1').subscribe(x => {
        expect(x).toEqual(category);
      })
      const req = httpMock.expectOne('https://localhost:8080/api/category/update/1');
      expect(req.request.method).toEqual('PUT');
      req.flush(category);
    });
  })
});
