import {TestBed} from '@angular/core/testing';

import {GamebrainapiService} from './gamebrainapi.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('GamebrainapiService', () => {
  let service: GamebrainapiService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:8080/api/gamebrain';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(GamebrainapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getGame()', () => {
    const gameName = 'Witcher 3';

    it('should POST to the correct URL', () => {
      //region Arrange
      service.getGames(gameName).subscribe();
      const req = httpMock.expectOne(`${API_URL}/search-game-details?gameName=Witcher%203`);
      expect(req.request.method).toBe('GET');
    });
  })
});
