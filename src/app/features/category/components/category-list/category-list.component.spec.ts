import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListComponent } from './category-list.component';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { signal } from '@angular/core';
import { CategoryStore } from '../../store/category-store';
import { Observable, Subject } from 'rxjs';
import { CategoryDto } from '../../models/category.dto';

describe('CategoryTableComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let confirmationServiceMock: ConfirmationService;
  let dialogServiceMock: DialogService;
  const refDialogMockSubject = new Subject<any>();
  let refDialogMock: { onClose: Observable<any> };
  const categoryStoreMock = {
    categories$: signal([]),
    isLoading: signal(false),
    getCategories: jest.fn(),

  };

  beforeEach(async () => {
    confirmationServiceMock = {
      confirm: jest.fn()
    } as unknown as ConfirmationService;
    refDialogMock = {
      onClose: refDialogMockSubject.asObservable()
    }
    dialogServiceMock = {
      open: jest.fn().mockReturnValue(refDialogMock),
    } as unknown as DialogService;



    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        { provide: ConfirmationService, useValue: confirmationServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: CategoryStore, useValue: categoryStoreMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should called getCategories', () => {
      expect(categoryStoreMock.getCategories).toHaveBeenCalled();
    });

    it('should set value for columns variable', () => {
      expect(component.columns().length).toEqual(6);
    });

  });

  describe('deleteCategory()', () => {
    const categoryId = '1';

    beforeEach(() => {
      component.deleteCategory(categoryId);
    })

    it('should called confirm method one times', () => {
      expect(confirmationServiceMock.confirm).toHaveBeenCalledTimes(1);
    });

  })

  describe('updateCategory()', () => {
    const categoryId = '1';

    beforeEach(() => {
      component.updateCategory(categoryId);
    })

    it('should called confirm method one times', () => {
      expect(dialogServiceMock.open).toHaveBeenCalledTimes(1);
    });

    it('should return category from onClose', () => {
      const category: CategoryDto = {
        categoryId: "cat-001",
        categoryName: "RPG",
        description: "Role-playing games",
        createdDate: "2024-01-15T10:30:00Z",
        updatedDate: "2024-11-20T14:45:00Z",
        createdBy: "admin",
        updatedBy: "editor",
        gamesCount: 24
      }
      refDialogMockSubject.next(category);
      refDialogMock.onClose.subscribe((value: CategoryDto) => {
        expect(value).toEqual(category);
      })

    });

    it('should return null from onClose', () => {
      refDialogMockSubject.next(null);
      refDialogMock.onClose.subscribe((value: CategoryDto) => {
        expect(value).toBeNull();
      })
    });

  })
});
