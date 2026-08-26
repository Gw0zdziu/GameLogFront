import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule, NgForm} from '@angular/forms';
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
  let ngForm: NgForm;

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
      set: {imports: [FormsModule], schemas: [NO_ERRORS_SCHEMA]},
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    ngForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
  });

  describe('form initialization', () => {
    it('form is invalid initially because categoryName is required', () => {
      expect(ngForm.valid).toBe(false);
    });

    it('categoryName is invalid when empty', () => {
      ngForm.controls['categoryName'].setValue('');
      expect(ngForm.controls['categoryName'].valid).toBe(false);
    });

    it('categoryName is invalid when shorter than 3 characters', () => {
      ngForm.controls['categoryName'].setValue('AB');
      expect(ngForm.controls['categoryName'].valid).toBe(false);
    });

    it('categoryName is valid with 3 or more characters', () => {
      ngForm.controls['categoryName'].setValue('RPG');
      expect(ngForm.controls['categoryName'].valid).toBe(true);
    });

    it('description is valid when empty', () => {
      ngForm.controls['description'].setValue('');
      expect(ngForm.controls['description'].valid).toBe(true);
    });
  });

  describe('submitForm()', () => {
    beforeEach(async () => {
      ngForm.controls['categoryName'].setValue('RPG');
      ngForm.controls['description'].setValue('Role-playing games');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('calls store.addCategory with form values', () => {
      component.submitForm(ngForm);

      expect(categoryStoreMock.addCategory).toHaveBeenCalledWith({
        newCategory: {categoryName: 'RPG', description: 'Role-playing games'},
        onSuccess: expect.any(Function),
      });
    });

    it('closes the dialog on success', () => {
      categoryStoreMock.addCategory.mockImplementation(
        ({onSuccess}: {onSuccess: () => void}) => onSuccess()
      );

      component.submitForm(ngForm);

      expect(dynamicDialogRefMock.close).toHaveBeenCalledWith(true);
    });

    it('refreshes the category list on success', () => {
      categoryStoreMock.addCategory.mockImplementation(
        ({onSuccess}: {onSuccess: () => void}) => onSuccess()
      );

      component.submitForm(ngForm);

      expect(categoryStoreMock.getCategories).toHaveBeenCalledWith(paginationState);
    });
  });
});