import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryUpdateComponent } from './category-update.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { signal } from '@angular/core';
import { CategoryStore } from '../../store/category-store';
import { CategoryService } from '../../services/category.service';
import { of } from 'rxjs';
import { CategoryDto } from '../../models/category.dto';


describe('CategoryUpdateComponent', () => {
  const category: CategoryDto = {
    categoryId: "a3f5c8e2-4b9d-4a1e-8f7c-9d2e5b6a8c1f",
    categoryName: "Action & Adventure",
    description: "Fast-paced games with combat and exploration.",
    createdDate: "2023-08-15T10:30:00.000Z",
    updatedDate: "2024-11-28T14:45:22.000Z",
    createdBy: "john.doe@example.com",
    updatedBy: "admin@example.com",
    gamesCount: 47
  }
  let component: CategoryUpdateComponent;
  let fixture: ComponentFixture<CategoryUpdateComponent>;
  let dialogServiceMock: jest.Mocked<Partial<DialogService>>;
  let dynamicDialogRefMock: jest.Mocked<Partial<DynamicDialogRef>>;
  const categoryStoreMock = {
    updateCategory: jest.fn(),
    isLoading: signal(false),
  };
  const categoryServiceMock = {
    getCategory: jest.fn().mockReturnValue(of(category)),
  }


  beforeEach(async () => {
    dialogServiceMock = {
      getInstance: jest.fn().mockReturnValue({
        data: '1'
      }),

    }
    dynamicDialogRefMock={
      close: jest.fn(),
    }
    await TestBed.configureTestingModule({
      imports: [CategoryUpdateComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: dynamicDialogRefMock },
        { provide: CategoryStore, useValue: categoryStoreMock},
        { provide: DialogService, useValue: dialogServiceMock},
        { provide: CategoryService, useValue: categoryServiceMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should categoryId assign value from create instance class', () => {
      expect(component.categoryId).toBe('1');
    });

    it('should updatedCategory signal assign value after create', () => {
      expect(component.updatedCategory()).toBe(category)
    });
  })

  describe('submitForm()', () => {
    beforeEach(() => {
    })
    it('should updateCategory() called with parameters', () => {
      component.submitForm();

      expect(categoryStoreMock.updateCategory).toHaveBeenCalled();
    })
    
  })

});
