import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GameService } from './game.service';
import { IS_AUTH_REQUIRED } from '../../../core/tokens/tokens';
import { GameDto } from '../models/game.dto';
import { GamePostDto } from '../models/game-post.dto';
import { GamePutDto } from '../models/game-put.dto';
import { PaginatedResults } from '../../../shared/models/paginated-results';
import { PaginatedQuery } from '../../../shared/models/paginated-query';

const GAME_ID = 'game-id-123';

const mockGame: GameDto = {
  gameId: GAME_ID,
  gameName: 'Test Game',
  gameUrl: 'https://example.com/game',
  categoryId: 'cat-1',
  categoryName: 'Action',
  createdDate: new Date('2024-01-01'),
  updatedDate: new Date('2024-01-02'),
  yearPlayed: new Date('2024-01-01'),
  createdBy: 'user-1',
  updatedBy: 'user-1',
};

const mockGamePostDto: GamePostDto = {
  gameName: 'New Game',
  gameImageUrl: 'https://example.com/image.png',
  categoryId: 'cat-1',
  yearPlayed: new Date('2024-01-01'),
};

const mockGamePutDto: GamePutDto = {
  gameName: 'Updated Game',
  gameImageUrl: 'https://example.com/image2.png',
  categoryId: 'cat-2',
  yearPlayed: new Date('2025-01-01'),
};

const mockPaginatedResults: PaginatedResults<GameDto> = {
  results: [mockGame],
  totalAmount: 1,
  pageNumber: 1,
  pageSize: 10,
  firstItemIndexList: 0,
  lastItemIndexList: 0,
  amountPagesList: [1],
};

const paginatedQuery: PaginatedQuery = { pageNumber: 1, pageSize: 10 };

const API_BASE = 'https://localhost:8080/api/games';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserGames()', () => {
    it('sends GET to /games/get-games with pagination params', () => {
      service.getUserGames(paginatedQuery).subscribe();

      const req = httpMock.expectOne(
        r => r.url === `${API_BASE}/get-games` &&
          r.params.get('pageNumber') === '1' &&
          r.params.get('pageSize') === '10'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResults);
    });

    it('returns paginated results', () => {
      service.getUserGames(paginatedQuery).subscribe(result => {
        expect(result).toEqual(mockPaginatedResults);
        expect(result.results).toHaveLength(1);
        expect(result.totalAmount).toBe(1);
      });

      httpMock.expectOne(r => r.url === `${API_BASE}/get-games`).flush(mockPaginatedResults);
    });

    it('sends request with withCredentials', () => {
      service.getUserGames(paginatedQuery).subscribe();

      const req = httpMock.expectOne(r => r.url === `${API_BASE}/get-games`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockPaginatedResults);
    });

    it('sets IS_AUTH_REQUIRED context token', () => {
      service.getUserGames(paginatedQuery).subscribe();

      const req = httpMock.expectOne(r => r.url === `${API_BASE}/get-games`);
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(mockPaginatedResults);
    });

    it('handles 401 error', () => {
      service.getUserGames(paginatedQuery).subscribe({
        error: err => expect(err.status).toBe(401),
      });

      httpMock.expectOne(r => r.url === `${API_BASE}/get-games`).flush('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized',
      });
    });
  });

  describe('deleteGame()', () => {
    it('sends DELETE to /games/delete/:gameId', () => {
      service.deleteGame(GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/delete/${GAME_ID}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('returns void', () => {
      service.deleteGame(GAME_ID).subscribe(result => {
        expect(result).toBeNull();
      });

      httpMock.expectOne(`${API_BASE}/delete/${GAME_ID}`).flush(null);
    });

    it('sends request with withCredentials', () => {
      service.deleteGame(GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/delete/${GAME_ID}`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(null);
    });

    it('sets IS_AUTH_REQUIRED context token', () => {
      service.deleteGame(GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/delete/${GAME_ID}`);
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(null);
    });

    it('handles 404 error', () => {
      service.deleteGame(GAME_ID).subscribe({
        error: err => expect(err.status).toBe(404),
      });

      httpMock.expectOne(`${API_BASE}/delete/${GAME_ID}`).flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });

  describe('createGame()', () => {
    it('sends POST to /games/create-game with body', () => {
      service.createGame(mockGamePostDto).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/create-game`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockGamePostDto);
      req.flush(mockGame);
    });

    it('returns created GameDto', () => {
      service.createGame(mockGamePostDto).subscribe(result => {
        expect(result).toEqual(mockGame);
        expect(result.gameId).toBe(GAME_ID);
      });

      httpMock.expectOne(`${API_BASE}/create-game`).flush(mockGame);
    });

    it('sends request with withCredentials', () => {
      service.createGame(mockGamePostDto).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/create-game`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockGame);
    });

    it('sets IS_AUTH_REQUIRED context token', () => {
      service.createGame(mockGamePostDto).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/create-game`);
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(mockGame);
    });

    it('handles 400 error', () => {
      service.createGame(mockGamePostDto).subscribe({
        error: err => expect(err.status).toBe(400),
      });

      httpMock.expectOne(`${API_BASE}/create-game`).flush('Bad Request', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });

  describe('updateGame()', () => {
    it('sends PUT to /games/update/:gameId with body', () => {
      service.updateGame(mockGamePutDto, GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/update/${GAME_ID}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockGamePutDto);
      req.flush(mockGame);
    });

    it('returns updated GameDto', () => {
      const updatedGame: GameDto = { ...mockGame, gameName: 'Updated Game' };

      service.updateGame(mockGamePutDto, GAME_ID).subscribe(result => {
        expect(result).toEqual(updatedGame);
      });

      httpMock.expectOne(`${API_BASE}/update/${GAME_ID}`).flush(updatedGame);
    });

    it('sends request with withCredentials', () => {
      service.updateGame(mockGamePutDto, GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/update/${GAME_ID}`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockGame);
    });

    it('sets IS_AUTH_REQUIRED context token', () => {
      service.updateGame(mockGamePutDto, GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/update/${GAME_ID}`);
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(mockGame);
    });

    it('handles 404 error', () => {
      service.updateGame(mockGamePutDto, GAME_ID).subscribe({
        error: err => expect(err.status).toBe(404),
      });

      httpMock.expectOne(`${API_BASE}/update/${GAME_ID}`).flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });

  describe('getGame()', () => {
    it('sends GET to /games/get-game/:gameId', () => {
      service.getGame(GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/get-game/${GAME_ID}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGame);
    });

    it('returns GameDto', () => {
      service.getGame(GAME_ID).subscribe(result => {
        expect(result).toEqual(mockGame);
        expect(result.gameName).toBe('Test Game');
      });

      httpMock.expectOne(`${API_BASE}/get-game/${GAME_ID}`).flush(mockGame);
    });

    it('sends request with withCredentials', () => {
      service.getGame(GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/get-game/${GAME_ID}`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockGame);
    });

    it('sets IS_AUTH_REQUIRED context token', () => {
      service.getGame(GAME_ID).subscribe();

      const req = httpMock.expectOne(`${API_BASE}/get-game/${GAME_ID}`);
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(mockGame);
    });

    it('handles 404 error', () => {
      service.getGame(GAME_ID).subscribe({
        error: err => expect(err.status).toBe(404),
      });

      httpMock.expectOne(`${API_BASE}/get-game/${GAME_ID}`).flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });
});