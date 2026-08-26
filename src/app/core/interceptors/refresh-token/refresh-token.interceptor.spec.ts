import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {refreshTokenInterceptor} from './refresh-token.interceptor';
import {RefreshTokenService} from '../../services/refresh-token/refresh-token.service';
import {AuthService} from '../../../features/auth/services/auth.service';
import {TokenStoreService} from '../../store/token-store/token-store.service';

describe('refreshTokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const refreshTokenServiceMock = { refreshToken: jest.fn() };
  const authServiceMock = { logoutUser: jest.fn().mockReturnValue(of(undefined)) };
  const tokenStoreMock = { updateToken: jest.fn() };
  const routerMock = { navigate: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([refreshTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: RefreshTokenService, useValue: refreshTokenServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: TokenStoreService, useValue: tokenStoreMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('successful request', () => {
    it('passes 2xx response through without modification', () => {
      let result: unknown;
      http.get('/api/data').subscribe(data => (result = data));

      httpMock.expectOne('/api/data').flush({ id: '1' });

      expect(result).toEqual({ id: '1' });
      expect(refreshTokenServiceMock.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('non-401 errors', () => {
    it('rethrows 403 error without attempting token refresh', () => {
      let receivedError: HttpErrorResponse | undefined;
      http.get('/api/data').subscribe({ error: err => (receivedError = err) });

      httpMock.expectOne('/api/data').flush('Forbidden', { status: 403, statusText: 'Forbidden' });

      expect(receivedError?.status).toBe(403);
      expect(refreshTokenServiceMock.refreshToken).not.toHaveBeenCalled();
    });

    it('rethrows 500 error without attempting token refresh', () => {
      let receivedError: HttpErrorResponse | undefined;
      http.get('/api/data').subscribe({ error: err => (receivedError = err) });

      httpMock.expectOne('/api/data').flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      expect(receivedError?.status).toBe(500);
      expect(refreshTokenServiceMock.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('excluded URLs — 401 does not trigger refresh', () => {
    it.each([
      '/api/auth/login',
      '/api/auth/refresh-token',
    ])('rethrows 401 for excluded URL: %s', (excludedUrl) => {
      let receivedError: HttpErrorResponse | undefined;
      http.get(excludedUrl).subscribe({ error: err => (receivedError = err) });

      httpMock.expectOne(excludedUrl).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(receivedError?.status).toBe(401);
      expect(refreshTokenServiceMock.refreshToken).not.toHaveBeenCalled();
    });
  });

  describe('401 on regular URL — token refresh', () => {
    it('calls refreshToken and retries request with new token', () => {
      refreshTokenServiceMock.refreshToken.mockReturnValue(of('new-token-abc'));

      let responseData: unknown;
      http.get('/api/data').subscribe({ next: data => (responseData = data) });

      // first request — 401 response
      httpMock.expectOne('/api/data').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(tokenStoreMock.updateToken).toHaveBeenCalledWith('new-token-abc');

      // second request (retry) with new token
      const retryReq = httpMock.expectOne('/api/data');
      expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token-abc');
      retryReq.flush({ id: '1' });

      expect(responseData).toEqual({ id: '1' });
    });

    it('calls refreshToken exactly once', () => {
      refreshTokenServiceMock.refreshToken.mockReturnValue(of('new-token'));

      http.get('/api/data').subscribe();

      httpMock.expectOne('/api/data').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      httpMock.expectOne('/api/data').flush({});

      expect(refreshTokenServiceMock.refreshToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('token refresh failure', () => {
    it('navigates to /login and logs out when refresh returns 400', () => {
      refreshTokenServiceMock.refreshToken.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 400, statusText: 'Bad Request' }))
      );

      let completed = false;
      http.get('/api/data').subscribe({ complete: () => (completed = true) });

      httpMock.expectOne('/api/data').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
      expect(authServiceMock.logoutUser).toHaveBeenCalledTimes(1);
      expect(completed).toBe(true);
    });

    it('returns EMPTY without navigating when refresh fails with non-400 error', () => {
      refreshTokenServiceMock.refreshToken.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' }))
      );

      let completed = false;
      http.get('/api/data').subscribe({ complete: () => (completed = true) });

      httpMock.expectOne('/api/data').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(authServiceMock.logoutUser).not.toHaveBeenCalled();
      expect(completed).toBe(true);
    });
  });
});
