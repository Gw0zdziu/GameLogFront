import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { TokenStoreService } from '../../store/token-store/token-store.service';
import { IS_AUTH_REQUIRED } from '../../tokens/tokens';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const mockToken = signal<string | null>('test-token-123');
  const tokenStoreMock: Partial<TokenStoreService> = {
    token$: mockToken,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenStoreService, useValue: tokenStoreMock },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('gdy IS_AUTH_REQUIRED = true (domyślnie)', () => {
    it('dodaje nagłówek Authorization gdy token istnieje', () => {
      mockToken.set('test-token-123');

      http.get('/api/data').subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      req.flush({});
    });

    it('nie dodaje nagłówka Authorization gdy token jest null', () => {
      mockToken.set(null);

      http.get('/api/data').subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('dodaje nagłówek z aktualną wartością tokena', () => {
      mockToken.set('different-token-xyz');

      http.get('/api/data').subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.get('Authorization')).toBe('Bearer different-token-xyz');
      req.flush({});
    });
  });

  describe('gdy IS_AUTH_REQUIRED = false', () => {
    it('nie dodaje nagłówka Authorization nawet gdy token istnieje', () => {
      mockToken.set('test-token-123');
      const context = new HttpContext().set(IS_AUTH_REQUIRED, false);

      http.get('/api/public', { context }).subscribe();

      const req = httpMock.expectOne('/api/public');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('przekazuje request bez modyfikacji gdy token jest null', () => {
      mockToken.set(null);
      const context = new HttpContext().set(IS_AUTH_REQUIRED, false);

      http.get('/api/public', { context }).subscribe();

      const req = httpMock.expectOne('/api/public');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  describe('gdy IS_AUTH_REQUIRED = true (jawnie)', () => {
    it('dodaje nagłówek Authorization gdy token istnieje', () => {
      mockToken.set('test-token-123');
      const context = new HttpContext().set(IS_AUTH_REQUIRED, true);

      http.get('/api/protected', { context }).subscribe();

      const req = httpMock.expectOne('/api/protected');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
      req.flush({});
    });

    it('nie dodaje nagłówka Authorization gdy token jest null', () => {
      mockToken.set(null);
      const context = new HttpContext().set(IS_AUTH_REQUIRED, true);

      http.get('/api/protected', { context }).subscribe();

      const req = httpMock.expectOne('/api/protected');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });
});
