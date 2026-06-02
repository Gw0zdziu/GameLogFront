import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, signal} from '@angular/core';
import {CategoryAddComponent} from './category-add.component';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {CategoryStore} from '../../store/category-store';
import {PaginationConfig} from '../../../../shared/models/pagination-config';

const paginationState: PaginationConfig = {
  pageNumber: 1,
  pageSize: 5,
  amountPagesList: [],
};

describe('CategoryAddComponent', () => {
  let component: CategoryAddComponent;
  let fixture: ComponentFixture<CategoryAddComponent>;

  const dynamicDialogRefMock = {close: jest.fn()};
  const categoryStoreMock = {
    addCategory: jest.fn(),
    getCategories: jest.fn(),
    isLoading: signal(false),
    paginationState: signal(paginationState),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CategoryAddComponent],
      providers: [
        {provide: DynamicDialogRef, useValue: dynamicDialogRefMock},
        {provide: CategoryStore, useValue: categoryStoreMock},
      ],
    }).overrideComponent(CategoryAddComponent, {
      set: {imports: [], schemas: [NO_ERRORS_SCHEMA]},
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('form initialization', () => {
    it('initializes with empty categoryName and description', () => {
      expect(component.newCategoryForm.value).toEqual({
        categoryName: '',
        description: '',
      });
    });

    it('categoryName is invalid when empty', () => {
      component.newCategoryForm.controls.categoryName.setValue('');
      expect(component.newCategoryForm.controls.categoryName.valid).toBe(false);
    });

    it('categoryName is invalid when shorter than 3 characters', () => {
      component.newCategoryForm.controls.categoryName.setValue('AB');
      expect(component.newCategoryForm.controls.categoryName.valid).toBe(false);
    });

    it('categoryName is valid with 3 or more characters', () => {
      component.newCategoryForm.controls.categoryName.setValue('RPG');
      expect(component.newCategoryForm.controls.categoryName.valid).toBe(true);
    });

    it('description is valid when empty', () => {
      component.newCategoryForm.controls.description.setValue('');
      expect(component.newCategoryForm.controls.description.valid).toBe(true);
    });
  });

  describe('submitForm()', () => {
    beforeEach(() => {
      component.newCategoryForm.setValue({
        categoryName: 'RPG',
        description: 'Role-playing games',
      });
    });

    it('calls store.addCategory with form values', () => {
      component.submitForm();

      expect(categoryStoreMock.addCategory).toHaveBeenCalledWith({
        newCategory: {categoryName: 'RPG', description: 'Role-playing games'},
        onSuccess: expect.any(Function),
      });
    });

    it('closes the dialog on success', () => {
      categoryStoreMock.addCategory.mockImplementation(
        ({onSuccess}: {onSuccess: () => void}) => onSuccess()
      );

      component.submitForm();

      expect(dynamicDialogRefMock.close).toHaveBeenCalledWith(true);
    });

    it('refreshes the category list on success', () => {
      categoryStoreMock.addCategory.mockImplementation(
        ({onSuccess}: {onSuccess: () => void}) => onSuccess()
      );

      component.submitForm();

      expect(categoryStoreMock.getCategories).toHaveBeenCalledWith(paginationState);
    });
  });
});