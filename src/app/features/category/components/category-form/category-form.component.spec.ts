import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFormComponent } from './category-form.component';
import { CategoryPostDto } from '../../models/category-post.dto';
import { signal } from '@angular/core';
import { CategoryStore } from '../../store/category-store';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent<CategoryPostDto>;
  let fixture: ComponentFixture<CategoryFormComponent<CategoryPostDto>>;
  const categoryStoreMock = {
    isLoading: signal(false),
  }



  describe('effect()', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CategoryFormComponent],
        providers: [{provide: CategoryStore, useValue: categoryStoreMock}]
      })
        .compileComponents();

      fixture = TestBed.createComponent(CategoryFormComponent);
      component = fixture.componentInstance;
    });

    it('should set value for newCategoryForm variable', () => {
      fixture.detectChanges();
      const category = {
        categoryName: "RPG",
        description: "Role-playing games",
      }
      component.category.set(category);
      fixture.detectChanges();
      expect(component.newCategoryForm.value).toEqual(category);
    })
  })

  describe('submitForm()', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CategoryFormComponent],
        providers: [{provide: CategoryStore, useValue: categoryStoreMock}]
      })
        .compileComponents();

      fixture = TestBed.createComponent(CategoryFormComponent);
      component = fixture.componentInstance;
    });

    it('should category model set value from form', () => {
      fixture.detectChanges();
      const category = {
        categoryName: "RPG",
        description: "Role-playing games",
      }
      component.newCategoryForm.setValue(category);
      component.submitForm();
      fixture.detectChanges();
      expect(component.category()).toEqual(category);
    });


  })
});
