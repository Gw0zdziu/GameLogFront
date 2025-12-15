import {CategoryStore} from './category-store';
import {CategoryPostDto} from '../models/category-post.dto';
import {CategoryService} from '../services/category.service';
import {of, throwError} from 'rxjs';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CategoryDto} from '../models/category.dto';
import {FormatDateDistancePipe} from '../../../core/pipes/format-date-distance.pipe';
import {ToastService} from '../../../core/services/toast/toast.service';
import {CategoryPutDto} from '../models/category-put.dto';

describe('CategoryStore', () => {
  const category: CategoryDto = {
    categoryId: "1",
    categoryName: "Action & Adventure",
    description: "Fast-paced games with combat and exploration.",
    createdDate: "2023-08-15T10:30:00.000Z",
    updatedDate: "2024-11-28T14:45:22.000Z",
    createdBy: "john.doe@example.com",
    updatedBy: "admin@example.com",
    gamesCount: 47
  }
  const updatedCategory: CategoryDto = {
    categoryId: '1',
    categoryName: 'Action & Adventure1',
    description: 'Fast-paced games with combat and exploration.',
    createdDate: '2023-08-15T10:30:00.000Z',
    updatedDate: '2024-11-28T14:45:22.000Z',
    createdBy: 'john.doe@example.com',
    updatedBy: 'admin@example.com',
    gamesCount: 47,
  };
  let store: InstanceType<typeof CategoryStore>;
  let mockCategoryService: jest.Mocked<Partial<CategoryService>>;
  let toastServiceMock: jest.Mocked<Partial<ToastService>>;
  let formatDateDistancePipeMock: jest.Mocked<Partial<FormatDateDistancePipe>>;
  beforeEach(() => {
    mockCategoryService = {
      getCategory: jest.fn().mockReturnValue(category),
      updateCategory: jest.fn().mockReturnValue(of(updatedCategory)),
      deleteCategory: jest.fn().mockReturnValue(of('1')),
      createCategory: jest.fn().mockReturnValue(of(category)),
      getUserCategories: jest.fn().mockReturnValue(of([category])),
    };
    toastServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    };
    formatDateDistancePipeMock = {
      transform: jest.fn().mockReturnValue('last year')
    }
    TestBed.configureTestingModule({
      providers: [
        CategoryStore,
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: FormatDateDistancePipe, useValue: formatDateDistancePipeMock },
      ]
    });
    store = TestBed.inject(CategoryStore);
  })

  it("should categories' array is empty after initialization", () => {
    expect(store.categories().length).toBe(0);
  });

  describe("categories$", () => {
    it('should update categories$ after add new category', fakeAsync(() => {
      const categoryPostDto: CategoryPostDto = {
        categoryName: 'Action & Adventure',
        description: 'Fast-paced games with combat and exploration.',
      };
      store.addCategory({
        newCategory: categoryPostDto,
        onSuccess: jest.fn(),
      });
      tick(300);
      expect(store.categories$()[0].updatedDate).toEqual('last year');
      expect(store.categories$()[0].createdDate).toEqual('last year');
    }));
  })

  describe("getCategories", () => {
    it('should return array of categories', fakeAsync(() => {
      store.getCategories();
      tick(300);
      expect(store.categories()).toHaveLength(1);
    }));

    it('should method return error when api request fails', fakeAsync(() => {
      jest
        .spyOn(mockCategoryService, 'getUserCategories')
        .mockReturnValue(throwError(() => new Error('Error')));
      store.getCategories();
      tick(300);
      expect(store.categories()).toHaveLength(0);
      expect(store.isLoading()).toBeFalsy();
    }));
  })

  describe("addCategory", () => {
    it('should add new category to state', fakeAsync(() => {
      const categoryPostDto: CategoryPostDto = {
        categoryName: "Action & Adventure",
        description: "Fast-paced games with combat and exploration.",

      }
      store.addCategory({
        newCategory: categoryPostDto,
        onSuccess: jest.fn()
      });
      tick(300);
      expect(store.categories()).toHaveLength(1);
    }));

    it('should method return error when api request fails', fakeAsync(() => {
      jest.spyOn(mockCategoryService, 'createCategory').mockReturnValue(throwError(() => new Error('Error')))
      const categoryPostDto: CategoryPostDto = {
        categoryName: "Action & Adventure",
        description: "Fast-paced games with combat and exploration.",

      }
      store.addCategory({
        newCategory: categoryPostDto,
        onSuccess: jest.fn()
      });
      tick(300);
      expect(toastServiceMock.showError).toHaveBeenCalled();
    }))

    it('should isLoading is false after complete method', fakeAsync(() => {
      const categoryPostDto: CategoryPostDto = {
        categoryName: 'Action & Adventure',
        description: 'Fast-paced games with combat and exploration.',
      };
      store.addCategory({
        newCategory: categoryPostDto,
        onSuccess: jest.fn(),
      });
      tick(300);
      expect(store.isLoading()).toBeFalsy();
    }));
  })

  describe("updateCategory", () => {
    it('should update a category in state', fakeAsync(() => {
      const categoryPutDto: CategoryPutDto = {
        categoryName: "updated category name",
        description: "Fast-paced games with combat and exploration.",
      }
      store.addCategory({
        newCategory: categoryPutDto,
        onSuccess: jest.fn(),
      });
      tick(300);
      store.updateCategory({
        category: categoryPutDto,
        categoryId: '1',
        onSuccess: jest.fn(),
      });
      tick(300);
      expect(store.categories()[0].categoryName).toEqual(updatedCategory.categoryName);
    }))

    it('should method return error when api request fails', fakeAsync(() => {
      jest
        .spyOn(mockCategoryService, 'updateCategory')
        .mockReturnValue(throwError(() => new Error('Error')));
      const categoryPutDto: CategoryPutDto = {
        categoryName: 'updated category name',
        description: 'Fast-paced games with combat and exploration.',
      };
      store.addCategory({
        newCategory: categoryPutDto,
        onSuccess: jest.fn(),
      });
      tick(300);
      store.updateCategory({
        category: categoryPutDto,
        categoryId: '1',
        onSuccess: jest.fn(),
      });
      tick(300);
      expect(toastServiceMock.showError).toHaveBeenCalled();
      expect(store.isLoading()).toBeFalsy();
    }));
  })

  describe("deleteCategory", () => {
    it('should delete a category from state', fakeAsync(() => {
      const categoryPostDto: CategoryPostDto = {
        categoryName: "Action & Adventure",
        description: "Fast-paced games with combat and exploration.",

      }
      store.addCategory({
        newCategory: categoryPostDto,
        onSuccess: jest.fn()
      });
      tick(300);
      store.deleteCategory('1')
      tick(300);
      expect(store.categories()).toHaveLength(0);
    }));

    it('should method return error when api request fails', fakeAsync(() => {
      jest
        .spyOn(mockCategoryService, 'deleteCategory')
        .mockReturnValue(throwError(() => new Error('Error')));
      const categoryPostDto: CategoryPostDto = {
        categoryName: 'Action & Adventure',
        description: 'Fast-paced games with combat and exploration.',
      };
      store.addCategory({
        newCategory: categoryPostDto,
        onSuccess: jest.fn(),
      });
      tick(300);
      store.deleteCategory('1');
      tick(300);
      expect(toastServiceMock.showError).toHaveBeenCalled();
      expect(store.isLoading()).toBeFalsy();
    }));
  });
})
