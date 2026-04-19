import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAddComponent } from './category-add.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryStore } from '../../store/category-store';
import { signal } from '@angular/core';
import { CategoryPostDto } from '../../models/category-post.dto';

describe('CategoryAddComponent', () => {
  let component: CategoryAddComponent;
  let fixture: ComponentFixture<CategoryAddComponent>;
  const dynamicDialogRef = {
    close: jest.fn()
  };
  const categoryStoreMock = {
    addCategory: jest.fn(),
    isLoading: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAddComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: dynamicDialogRef},
        { provide: CategoryStore, useValue: categoryStoreMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should component create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize newCategory signal with null', () => {
    expect(component.newCategoryForm.value).toBeNull();
  });

  describe('postNewCategory()', () => {


    it('should call addCategory method from store', () => {
      const newCategory: CategoryPostDto = {
        categoryName: "RPG",
        description: "Role-playing games",
      }
      component.newCategoryForm.setValue(newCategory);
      component.submitForm();
      expect(categoryStoreMock.addCategory).toHaveBeenCalled();
    })




  })
});
