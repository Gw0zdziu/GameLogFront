import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameFormComponent} from './game-form.component';
import {GamePostDto} from '../../models/game-post.dto';
import {signal} from '@angular/core';
import {CategoryStore} from '../../../category/store/category-store';
import {GameStore} from '../../store/game-store';
import {CategoryDto} from '../../../category/models/category.dto';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';

describe('GameFormComponent', () => {
  const categories: CategoryDto[] = [
    {
      categoryId: "cat-001",
      categoryName: "RPG",
      description: "Role-playing games with character development and story-driven gameplay",
      createdDate: new Date("2024-01-15"),
      updatedDate: new Date("2024-11-20"),
      createdBy: "admin@example.com",
      updatedBy: "moderator@example.com",
      gamesCount: 47
    },
    {
      categoryId: "cat-002",
      categoryName: "Strategiczne",
      description: "Gry wymagające planowania i taktycznego myślenia",
      createdDate: "2024-03-22T10:30:00Z",
      updatedDate: "2024-12-01T14:45:00Z",
      createdBy: "jan.kowalski@example.com",
      updatedBy: "jan.kowalski@example.com",
      gamesCount: 23
    }
  ]
  let component: GameFormComponent<GamePostDto>;
  let fixture: ComponentFixture<GameFormComponent<GamePostDto>>;
  const categoryStore = {
    categories: signal(categories),
    getCategories: jest.fn(),
  }
  const gameStore = {
    isLoading: signal(false),
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameFormComponent],
      providers: [
        {provide: CategoryStore, useValue: categoryStore},
        {provide: GameStore, useValue: gameStore}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameFormComponent<GamePostDto>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('effect()', () => {


  it('should set selectedCategory variable', () => {
    const category = {
      gameId: 'gameName',
      categoryId: 'cat-001',
    }
    fixture.componentRef.setInput('updatedGame', category);
    fixture.detectChanges();
    expect(component.selectedCategory()?.categoryName).toBe('RPG');
  });

    it('should set gameName variable', () => {
      const category = {
        gameName: 'gameName',
        categoryId: 'cat-001',
      }
      fixture.componentRef.setInput('updatedGame', category);
      fixture.detectChanges();
      expect(component.gameName()).toBe('gameName');
    });

  })

  describe('ngOnInit()', () => {
    it('should called getCategories method', () => {
      expect(categoryStore.getCategories).toHaveBeenCalled();
    });
  })

  describe('filterCategory()', () => {
    it('should ', () => {
      const event: { query: string } = {
        query: 'RPG'
      }
      component.filterCategory(event as AutoCompleteCompleteEvent);
      expect(component.filteredCategories()).toHaveLength(1);
      expect(component.isNotSelectCategory()).toBeFalsy();
    });
  })

  describe('selectCategory()', () => {
    it('should set isNotSelectCategory on true', () => {
      component.selectCategory();
      expect(component.isNotSelectCategory()).toBeTruthy();
    });
  })

  describe('formSubmit()', () => {
    it('should submitEmitter emit value', () => {
      component.gameName.set('gameName');
      component.selectedCategory.set(categories[0]);
      component.formSubmit();
      component.submitEmitter.subscribe(value => {
        expect(value).toEqual({
          categoryId: categories[0].categoryId,
          gameName: 'gameName'
        })
      })
    });
  })
});
