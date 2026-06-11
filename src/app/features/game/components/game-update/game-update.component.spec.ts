import {ComponentFixture, TestBed} from '@angular/core/testing';
import {signal} from '@angular/core';
import {GameUpdateComponent} from './game-update.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameStore} from '../../store/game-store';
import {GameService} from '../../services/game.service';
import {CategoryStore} from '../../../category/store/category-store';
import {UserStore} from '../../../../core/store/user-store/user-store';
import {GamebrainapiService} from '../../services/gamebrainapi/gamebrainapi.service';
import {Subject} from 'rxjs';
import {GameDto} from '../../models/game.dto';

describe('GameUpdateComponent', () => {
  let component: GameUpdateComponent;
  let fixture: ComponentFixture<GameUpdateComponent>;

  const gameSubject = new Subject<GameDto>();
  const game: GameDto = {
    gameId: 'gameId',
    gameName: 'gameName',
    gameUrl: 'gameUrl',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: new Date(),
    updatedDate: new Date(),
    yearPlayed: new Date('2023-01-01'),
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
  };

  const dynamicDialogRefMock = {close: jest.fn()};
  const dialogServiceMock = {
    getInstance: jest.fn().mockReturnValue({data: '1'}),
  };
  const gameServiceMock = {
    getGame: jest.fn().mockReturnValue(gameSubject.asObservable()),
  };
  const gameStoreMock = {
    updateGame: jest.fn(),
    isLoading: signal(false),
  };
  const categoryStoreMock = {
    getCategoriesByUserId: jest.fn(),
    categories: signal([
      {categoryId: 'categoryId', categoryName: 'categoryName'} as any,
    ]),
  };
  const userStoreMock = {
    userId: signal<string | undefined>('user-id'),
  };
  const gameBrainServiceMock = {
    getGames: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [GameUpdateComponent],
      providers: [
        {provide: DynamicDialogRef, useValue: dynamicDialogRefMock},
        {provide: DialogService, useValue: dialogServiceMock},
        {provide: GameService, useValue: gameServiceMock},
        {provide: GameStore, useValue: gameStoreMock},
        {provide: CategoryStore, useValue: categoryStoreMock},
        {provide: UserStore, useValue: userStoreMock},
        {provide: GamebrainapiService, useValue: gameBrainServiceMock},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should set gameName form value after game is loaded', () => {
      gameSubject.next(game);
      expect(component.updateGameForm.controls.gameName.value).toBe(game.gameName);
    });
  });

  describe('submitUpdateGame()', () => {
    beforeEach(() => {
      component.updateGameForm.setValue({
        gameName: 'Game',
        gameImage: 'gameImageUrl',
        selectedCategory: {categoryId: 'cat-001', categoryName: 'Test'},
        yearPlayed: new Date('2023-06-01'),
      });
    });

    it('should call updateGame from gameStore with form values', () => {
      component.submitUpdateGame();
      expect(gameStoreMock.updateGame).toHaveBeenCalledWith({
        gameId: '1',
        updatedGame: {
          gameName: 'Game',
          categoryId: 'cat-001',
          gameImageUrl: 'gameImageUrl',
          yearPlayed: new Date('2023-06-01'),
        },
        onSuccess: expect.any(Function),
      });
    });

    it('should close the dialog when onSuccess is called', () => {
      gameStoreMock.updateGame.mockImplementation((param: {onSuccess: () => void}) => {
        param.onSuccess();
      });
      component.submitUpdateGame();
      expect(dynamicDialogRefMock.close).toHaveBeenCalledWith(true);
    });
  });
});