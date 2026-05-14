import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RefreshTokenService } from './refresh-token.service';
import { environment } from '../../../../environments/environment';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let httpMock: HttpTestingController;

  const REFRESH_URL = `${environment.apiUrl}/auth/refresh-token`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RefreshTokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(RefreshTokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('refreshToken()', () => {
    it('sends a POST request to the correct URL', () => {
      service.refreshToken().subscribe();

      const req = httpMock.expectOne(REFRESH_URL);
      expect(req.request.method).toBe('POST');
      req.flush('new-token');
    });

    it('sends the request with withCredentials enabled', () => {
      service.refreshToken().subscribe();

      const req = httpMock.expectOne(REFRESH_URL);
      expect(req.request.withCredentials).toBe(true);
      req.flush('new-token');
    });

    it('sends an empty body', () => {
      service.refreshToken().subscribe();

      const req = httpMock.expectOne(REFRESH_URL);
      expect(req.request.body).toEqual({});
      req.flush('new-token');
    });

    it('returns the token string from the response', () => {
      let result: string | undefined;
      service.refreshToken().subscribe(token => (result = token));

      httpMock.expectOne(REFRESH_URL).flush('my-refresh-token-xyz');

      expect(result).toBe('my-refresh-token-xyz');
    });

    it('propagates 400 errors to the caller', () => {
      let receivedError: { status: number } | undefined;
      service.refreshToken().subscribe({ error: err => (receivedError = err) });

      httpMock.expectOne(REFRESH_URL).flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      expect(receivedError?.status).toBe(400);
    });

    it('propagates 401 errors to the caller', () => {
      let receivedError: { status: number } | undefined;
      service.refreshToken().subscribe({ error: err => (receivedError = err) });

      httpMock.expectOne(REFRESH_URL).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(receivedError?.status).toBe(401);
    });
  });
});
