import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, signal} from '@angular/core';
import {GameAddComponent} from './game-add.component';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameStore} from '../../store/game-store';
import {CategoryStore} from '../../../category/store/category-store';
import {UserStore} from '../../../../core/store/user-store/user-store';
import {GamebrainapiService} from '../../services/gamebrainapi/gamebrainapi.service';
import {of} from 'rxjs';
import {CategoryDto} from '../../../category/models/category.dto';
import {GameDetailsDto} from '../../models/game-details.dto';
import type {AutoCompleteCompleteEvent, AutoCompleteSelectEvent} from 'primeng/autocomplete';

const makeCategory = (overrides: Partial<CategoryDto> = {}): CategoryDto => ({
  categoryId: 'cat-1',
  categoryName: 'RPG',
  description: '',
  createdDate: new Date(),
  updatedDate: new Date(),
  createdBy: '',
  updatedBy: '',
  gamesCount: 0,
  ...overrides,
});

describe('GameAddComponent', () => {
  let component: GameAddComponent;
  let fixture: ComponentFixture<GameAddComponent>;

  const dynamicDialogRefMock = {close: jest.fn()};
  const gameStoreMock = {
    postGame: jest.fn(),
    getGames: jest.fn(),
    isLoading: signal(false),
  };
  const categoriesSignal = signal<CategoryDto[]>([]);
  const categoryStoreMock = {
    getCategoriesByUserId: jest.fn(),
    categories: categoriesSignal,
  };
  const userStoreMock = {userId: signal<string | undefined>('user-1')};
  const gameBrainServiceMock = {
    getGames: jest.fn().mockReturnValue(of([])),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    categoriesSignal.set([]);

    await TestBed.configureTestingModule({
      imports: [GameAddComponent],
      providers: [
        {provide: DynamicDialogRef, useValue: dynamicDialogRefMock},
        {provide: GameStore, useValue: gameStoreMock},
        {provide: CategoryStore, useValue: categoryStoreMock},
        {provide: UserStore, useValue: userStoreMock},
        {provide: GamebrainapiService, useValue: gameBrainServiceMock},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(GameAddComponent, {
      set: {imports: [], schemas: [NO_ERRORS_SCHEMA]},
    }).compileComponents();

    fixture = TestBed.createComponent(GameAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('loads categories for the current user', () => {
      expect(categoryStoreMock.getCategoriesByUserId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('filterCategory()', () => {
    const categories = [
      makeCategory({categoryId: 'cat-1', categoryName: 'RPG'}),
      makeCategory({categoryId: 'cat-2', categoryName: 'Strategia'}),
      makeCategory({categoryId: 'cat-3', categoryName: 'rpg Taktyczne'}),
    ];

    it('filters categories case-insensitively by query', () => {
      categoriesSignal.set(categories);

      component.filterCategory({query: 'rpg'} as AutoCompleteCompleteEvent);

      expect(component.filteredCategories()).toHaveLength(2);
      expect(component.filteredCategories().map(c => c.categoryId)).toEqual(['cat-1', 'cat-3']);
    });

    it('sets isNotSelectCategory to false when matches are found', () => {
      categoriesSignal.set(categories);

      component.filterCategory({query: 'rpg'} as AutoCompleteCompleteEvent);

      expect(component.isNotSelectCategory()).toBe(false);
    });

    it('sets isNotSelectCategory to true when no matches are found', () => {
      categoriesSignal.set(categories);

      component.filterCategory({query: 'xyz'} as AutoCompleteCompleteEvent);

      expect(component.isNotSelectCategory()).toBe(true);
    });
  });

  describe('selectCategory()', () => {
    it('sets isNotSelectCategory to true', () => {
      component.isNotSelectCategory.set(false);

      component.selectCategory();

      expect(component.isNotSelectCategory()).toBe(true);
    });
  });

  describe('submitNewGame()', () => {
    const category = makeCategory({categoryId: 'cat-1'});
    const date = new Date('2024-01-01');

    beforeEach(() => {
      component.newGameForm.setValue({
        gameName: 'Elden Ring',
        categoryId: category as unknown as string,
        yearPlayed: date,
        gameImage: 'https://image.example.com/elden.jpg',
      });
    });

    it('calls gameStore.postGame with values from the form', () => {
      component.submitNewGame();

      expect(gameStoreMock.postGame).toHaveBeenCalledWith({
        newGame: {
          gameName: 'Elden Ring',
          gameImageUrl: 'https://image.example.com/elden.jpg',
          categoryId: 'cat-1',
          yearPlayed: date,
        },
        onSuccess: expect.any(Function),
      });
    });

    it('refreshes games and closes dialog on success', () => {
      gameStoreMock.postGame.mockImplementation(({onSuccess}: {onSuccess: () => void}) => onSuccess());

      component.submitNewGame();

      expect(gameStoreMock.getGames).toHaveBeenCalledWith(null);
      expect(dynamicDialogRefMock.close).toHaveBeenCalledWith(true);
    });
  });

  describe('filterGames()', () => {
    it('calls gameBrainService.getGames and updates games signal after debounce', fakeAsync(() => {
      const mockGames: GameDetailsDto[] = [{name: 'Elden Ring', image: 'elden.jpg'}];
      gameBrainServiceMock.getGames.mockReturnValue(of(mockGames));

      component.filterGames({query: 'elden'} as AutoCompleteCompleteEvent);
      tick(1001);

      expect(gameBrainServiceMock.getGames).toHaveBeenCalledWith('elden');
      expect(component.games()).toEqual(mockGames);
    }));

    it('ignores empty query', fakeAsync(() => {
      component.filterGames({query: ''} as AutoCompleteCompleteEvent);
      tick(1001);

      expect(gameBrainServiceMock.getGames).not.toHaveBeenCalled();
    }));

    it('clears gameImage when search returns no results', fakeAsync(() => {
      gameBrainServiceMock.getGames.mockReturnValue(of([]));
      component.newGameForm.controls.gameImage.setValue('existing-image.jpg');

      component.filterGames({query: 'unknown'} as AutoCompleteCompleteEvent);
      tick(1001);

      expect(component.newGameForm.controls.gameImage.value).toBe('');
    }));
  });

  describe('selectGame()', () => {
    it('patches gameName and gameImage from the selected game', () => {
      component.selectGame({value: {name: 'Elden Ring', image: 'elden.jpg'}} as AutoCompleteSelectEvent);

      expect(component.newGameForm.get('gameName')?.value).toBe('Elden Ring');
      expect(component.newGameForm.get('gameImage')?.value).toBe('elden.jpg');
    });
  });

  describe('removeSelectGame()', () => {
    it('resets gameName and gameImage controls', () => {
      component.newGameForm.patchValue({gameName: 'Elden Ring', gameImage: 'elden.jpg'});

      component.removeSelectGame();

      expect(component.newGameForm.controls.gameImage.value).toBe('');
      expect(component.newGameForm.controls.gameName.value).toBeNull();
    });
  });
});
