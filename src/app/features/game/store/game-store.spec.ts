import {GameStore} from './game-store';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {GameService} from '../services/game.service';
import {FormatDateDistancePipe} from '../../../core/pipes/format-date-distance.pipe';
import {ToastService} from '../../../core/services/toast/toast.service';
import {GameDto} from '../models/game.dto';
import {EMPTY, of, throwError} from 'rxjs';
import {GamePostDto} from '../models/game-post.dto';
import {GamePutDto} from '../models/game-put.dto';


describe('GameStore', () => {
  const game: GameDto = {
    gameId: 'gameId',
    gameName: 'gameName',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: '2023-08-15T10:30:00.000Z',
    updatedDate: '2024-11-28T14:45:22.000Z',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
  };
  const updatedGame: GameDto = {
    gameId: '1',
    gameName: 'gameNameUpdated',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: '2023-08-15T10:30:00.000Z',
    updatedDate: '2024-11-28T14:45:22.000Z',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
  };
  let store: InstanceType<typeof GameStore>;
  let gameServiceMock: jest.Mocked<Partial<GameService>>;
  let formatDateDistancePipeMock: jest.Mocked<Partial<FormatDateDistancePipe>>;
  let toastServiceMock: jest.Mocked<Partial<ToastService>>;
   beforeEach( () => {
     gameServiceMock = {
       getGame: jest.fn(),
       getUserGames: jest.fn().mockReturnValue(of([game])),
       createGame: jest.fn().mockReturnValue(of(game)),
       updateGame: jest.fn().mockReturnValue(of(updatedGame)),
       deleteGame: jest.fn().mockReturnValue(of(EMPTY)),
     };
     toastServiceMock = {
       showSuccess: jest.fn(),
       showError: jest.fn()
     }
     formatDateDistancePipeMock = {
       transform: jest.fn().mockReturnValue('last year')
     }
      TestBed.configureTestingModule({
      providers: [
        GameStore,
        {
          provide: GameService, useValue: gameServiceMock,
        },
        {
          provide: FormatDateDistancePipe, useValue: formatDateDistancePipeMock
        },
        {
          provide: ToastService, useValue: toastServiceMock
        }
        ]
    })
     store = TestBed.inject(GameStore);
  });
  it('should init store with empty array', () => {
    expect(store.games()).toHaveLength(0);
    expect(store.isLoading()).toBeFalsy();
  });

   describe('games$', () => {
     it('should update games$ after add new game', fakeAsync(() => {
       const newGame: GamePostDto = {
         gameName: 'gameName',
         categoryId: 'categoryId',
       }
       store.postGame({
         newGame,
         onSuccess: jest.fn(),
       })
       tick(300);
       expect(store.games$()).toHaveLength(1);
     }));
   })

   describe('getGames', () => {
     it('should return array of games', fakeAsync(() => {
       store.getGames();
       tick(300);
       expect(store.games()).toHaveLength(1);
     }));

     it('should called showError when calling api return error', fakeAsync(() => {
       const messageError = 'Error';
       jest.spyOn(gameServiceMock, 'getUserGames').mockReturnValue(throwError(() => new Error(messageError)));
       store.getGames();
       tick(300);
       expect(toastServiceMock.showError).toHaveBeenCalled();
       expect(store.games()).toHaveLength(0);
     }));
   })

  describe('postGame', () => {
    it('should games state after called postGame method', fakeAsync(() => {
      const newGame: GamePostDto = {
        gameName: 'gameName',
        categoryId: 'categoryId',
      }
      store.postGame({
        newGame,
        onSuccess: jest.fn(),
      })
      tick(300);
      expect(store.games()).toHaveLength(1);
    }));

    it('should called showError when calling api return error', fakeAsync(() => {
      const messageError = 'Error';
      jest.spyOn(gameServiceMock, 'createGame')
        .mockReturnValue(throwError(() => new Error(messageError)));
      const newGame: GamePostDto = {
        gameName: 'gameName',
        categoryId: 'categoryId',
      }
      store.postGame({
        newGame,
        onSuccess: jest.fn(),
      })
      tick(300)
      expect(toastServiceMock.showError).toHaveBeenCalledTimes(1);
      expect(store.games()).toHaveLength(0);
    }));
  })

  describe('updateGame', () => {
    it('should update game in state', fakeAsync(() => {
      const gameToUpdate: GamePutDto = {
        gameName: 'gameNameUpdated',
        categoryId: 'categoryId',
      };
      store.setGameState({
        games: [updatedGame, game],
        isLoading: false
      })
      store.updateGame({
        updatedGame: gameToUpdate,
        gameId: '1',
        onSuccess: jest.fn(),
      })
      tick(300);
      expect(store.games()[0].gameName).toBe(gameToUpdate.gameName);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledTimes(1);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Pomyślnie zaktualizowano grę');
    }))

    it('should called showError method when api method return error', fakeAsync(() => {
      const messageError = 'Error';
      jest.spyOn(gameServiceMock, 'updateGame')
        .mockReturnValue(throwError(() => new Error(messageError)));
      const updatedGame: GamePutDto = {
        gameName: 'updated game name',
        categoryId: 'categoryId',
      }
      store.updateGame({
        updatedGame: updatedGame,
        gameId: 'gameId',
        onSuccess: jest.fn(),
      })
      tick(300);
      expect(toastServiceMock.showError).toHaveBeenCalledTimes(1);
      expect(store.games()).toHaveLength(0)
    }));
  })
  describe('deleteGame', () => {
    it('should games state included one game', fakeAsync(() => {
      store.setGameState({
        games: [updatedGame, game],
        isLoading: false
      });
      store.deleteGame('1')
      tick(300);
      expect(store.games()).toHaveLength(1);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledTimes(1);
      expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Pomyślnie usunięto grę');
    }));

    it('should called showError method when api method return error', fakeAsync(() => {
      const messageError = 'Error';
      jest.spyOn(gameServiceMock, 'deleteGame')
        .mockReturnValue(throwError(() => new Error(messageError)));
      store.setGameState({
        games: [updatedGame, game],
        isLoading: false
      })
      store.deleteGame('1');
      tick(300);
      expect(store.games()).toHaveLength(2);
      expect(toastServiceMock.showError).toHaveBeenCalledTimes(1);
    }));
  })
})
