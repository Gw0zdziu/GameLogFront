import {TestBed} from '@angular/core/testing';

import {GameService} from './game.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {GameDto} from '../models/game.dto';
import {GamePostDto} from '../models/game-post.dto';

describe('GameService', () => {
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
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserGames()', () => {
    it('should make GET request and return games', () => {
        service.getUserGames().subscribe(games => {
          expect(games).toEqual([game]);
        })

      const req = httpMock.expectOne('https://localhost:8080/api/games/get-games');
      expect(req.request.method).toEqual('GET');
      req.flush([game]);
    })
  });

  describe('getGame()', () => {
    it('should make GET request and return game', () => {
      service.getGame('gameId').subscribe(game => {
        expect(game).toEqual(game);
      })

      const req = httpMock.expectOne('https://localhost:8080/api/games/get-game/gameId');
      expect(req.request.method).toEqual('GET');
      req.flush(game);
    })
  })

  describe('createGame()', () => {
    it('should make POST request and return game', () => {
      const gameDto: GamePostDto = {
        gameName: 'gameName',
        categoryId: 'categoryId',
      }
      service.createGame(gameDto).subscribe(x => {
        expect(x).toEqual(game);
      })
      const req = httpMock.expectOne('https://localhost:8080/api/games/create-game');
      expect(req.request.method).toEqual('POST');
      req.flush(game);
    });
  })

  describe('deleteGame()', () => {
    it('should delete game and return void', () => {
      service.deleteGame('gameId').subscribe(x => {
        expect(x).toBeUndefined();
      })
      const req = httpMock.expectOne('https://localhost:8080/api/games/delete/gameId');
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });
  })

  describe('updateGame()', () => {
    it('should update return new category', () => {
      service.updateGame(game, 'gameId').subscribe(x => {
        expect(x).toEqual(game);
      })
      const req = httpMock.expectOne('https://localhost:8080/api/games/update/gameId');
      expect(req.request.method).toEqual('PUT');
      req.flush(game);
    });
  })
});
