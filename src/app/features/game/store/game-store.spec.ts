import { GameStore } from './game-store';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { GameService } from '../services/game.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { GameDto } from '../models/game.dto';
import { EMPTY, of, throwError } from 'rxjs';
import { GamePostDto } from '../models/game-post.dto';
import { GamePutDto } from '../models/game-put.dto';
import { PaginationConfig } from '../../../shared/models/pagination-config';

const defaultPagination: PaginationConfig = { pageNumber: 1, pageSize: 5, amountPagesList: [] };

describe('GameStore', () => {
  const game: GameDto = {
    gameId: 'gameId',
    gameName: 'gameName',
    gameUrl: '',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: new Date('2023-08-15T10:30:00.000Z'),
    updatedDate: new Date('2024-11-28T14:45:22.000Z'),
    yearPlayed: new Date('2023-01-01T00:00:00.000Z'),
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
  };
  const updatedGame: GameDto = {
    gameId: '1',
    gameName: 'gameNameUpdated',
    gameUrl: '',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: new Date('2023-08-15T10:30:00.000Z'),
    updatedDate: new Date('2024-11-28T14:45:22.000Z'),
    yearPlayed: new Date('2023-01-01T00:00:00.000Z'),
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
  };

  let store: InstanceType<typeof GameStore>;
  let gameServiceMock: jest.Mocked<Partial<GameService>>;
  let toastServiceMock: jest.Mocked<Partial<ToastService>>;

  beforeEach(() => {
    gameServiceMock = {
      getGame: jest.fn(),
      getUserGames: jest.fn().mockReturnValue(of({
        results: [game],
        pageNumber: 1,
        pageSize: 5,
        amountPagesList: [],
      })),
      createGame: jest.fn().mockReturnValue(of(game)),
      updateGame: jest.fn().mockReturnValue(of(updatedGame)),
      deleteGame: jest.fn().mockReturnValue(of(EMPTY)),
    };
    toastServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameStore,
        { provide: GameService, useValue: gameServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    });
    store = TestBed.inject(GameStore);
  });

  afterEach(() => jest.clearAllMocks());

  it('should init store with empty array', () => {
    expect(store.games()).toHaveLength(0);
    expect(store.isLoading()).toBeFalsy();
  });

  describe('getGames', () => {
    it('should return array of games', fakeAsync(() => {
      store.getGames(null);
      tick(300);
      expect(store.games()).toHaveLength(1);
    }));

    it('should call showError when api returns error', fakeAsync(() => {
      jest.spyOn(gameServiceMock, 'getUserGames').mockReturnValue(throwError(() => new Error('Error')));
      store.getGames(null);
      tick(300);
      expect(toastServiceMock.showError).toHaveBeenCalled();
      expect(store.games()).toHaveLength(0);
    }));
  });

  describe('postGame', () => {
    it('should add game to state after postGame', fakeAsync(() => {
      const newGame: GamePostDto = { gameName: 'gameName', categoryId: 'categoryId', gameImageUrl: '', yearPlayed: null };
      store.postGame({ newGame, onSuccess: jest.fn() });
      tick(300);
      expect(store.games()).toHaveLength(1);
    }));

    it('should call showError when api returns error', fakeAsync(() => {
      jest.spyOn(gameServiceMock, 'createGame').mockReturnValue(throwError(() => new Error('Error')));
      const newGame: GamePostDto = { gameName: 'gameName', categoryId: 'categoryId', gameImageUrl: '', yearPlayed: null };
      store.postGame({ newGame, onSuccess: jest.fn() });
      tick(300);
      expect(toastServiceMock.showError).toHaveBeenCalledTimes(1);
      expect(store.games()).toHaveLength(0);
    }));
  });

  describe('updateGame', () => {
    it('should update game in state', fakeAsync(() => {
      const gameToUpdate: GamePutDto = { gameName: 'gameNameUpdated', categoryId: 'categoryId', gameImageUrl: '', yearPlayed: null };
      store.setGameState({ games: [updatedGame, game], isLoading: false, paginationState: defaultPagination });
      store.updateGame({ updatedGame: gameToUpdate, gameId: '1', onSuccess: jest.fn() });
      tick(300);
      expect(store.games()[0].gameName).toBe(gameToUpdate.gameName);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledTimes(1);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Pomyślnie zaktualizowano grę');
    }));

    it('should call showError when api returns error', fakeAsync(() => {
      jest.spyOn(gameServiceMock, 'updateGame').mockReturnValue(throwError(() => new Error('Error')));
      const gameToUpdate: GamePutDto = { gameName: 'updated game name', categoryId: 'categoryId', gameImageUrl: '', yearPlayed: null };
      store.updateGame({ updatedGame: gameToUpdate, gameId: 'gameId', onSuccess: jest.fn() });
      tick(300);
      expect(toastServiceMock.showError).toHaveBeenCalledTimes(1);
      expect(store.games()).toHaveLength(0);
    }));
  });

  describe('deleteGame', () => {
    it('should remove game from state', fakeAsync(() => {
      store.setGameState({ games: [updatedGame, game], isLoading: false, paginationState: defaultPagination });
      store.deleteGame({ gameId: '1', onSuccess: jest.fn() });
      tick(300);
      expect(store.games()).toHaveLength(1);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledTimes(1);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Pomyślnie usunięto grę');
    }));

    it('should call showError when api returns error', fakeAsync(() => {
      jest.spyOn(gameServiceMock, 'deleteGame').mockReturnValue(throwError(() => new Error('Error')));
      store.setGameState({ games: [updatedGame, game], isLoading: false, paginationState: defaultPagination });
      store.deleteGame({ gameId: '1', onSuccess: jest.fn() });
      tick(300);
      expect(store.games()).toHaveLength(2);
      expect(toastServiceMock.showError).toHaveBeenCalledTimes(1);
    }));
  });
});
