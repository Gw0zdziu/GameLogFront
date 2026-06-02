import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';

import {AuthService} from './auth.service';
import {LoggedStoreService} from '../../../core/store/logged-store/logged-store.service';
import {UserStore} from '../../../core/store/user-store/user-store';
import {TokenStoreService} from '../../../core/store/token-store/token-store.service';
import {ToastService} from '../../../core/services/toast/toast.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockLoggedStore = { setLogged: jest.fn() };
  const mockUserStore = { cleanStore: jest.fn() };
  const mockTokenStore = { updateToken: jest.fn() };
  const mockToastService = { showSuccess: jest.fn(), showError: jest.fn() };

  const API_URL = 'https://localhost:8080/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: LoggedStoreService, useValue: mockLoggedStore },
        { provide: UserStore, useValue: mockUserStore },
        { provide: TokenStoreService, useValue: mockTokenStore },
        { provide: ToastService, useValue: mockToastService },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loginUser()', () => {
    const loginDto = { userName: 'baxter5xl', password: 'secret123' };

    it('should POST to the correct URL', () => {
      service.loginUser(loginDto).subscribe();
      const req = httpMock.expectOne(`${API_URL}/login`);
      expect(req.request.method).toBe('POST');
    });

    it('should send withCredentials', () => {
      service.loginUser(loginDto).subscribe();
      const req = httpMock.expectOne(`${API_URL}/login`);
      expect(req.request.withCredentials).toBe(true);
      req.flush('token');
    });

    it('should send the login credentials in the body', () => {
      service.loginUser(loginDto).subscribe();
      const req = httpMock.expectOne(`${API_URL}/login`);
      expect(req.request.body).toEqual(loginDto);
      req.flush('token');
    });

    it('should call tokenStoreService.updateToken with received token on success', () => {
      service.loginUser(loginDto).subscribe();
      httpMock.expectOne(`${API_URL}/login`).flush('my-token');
      expect(mockTokenStore.updateToken).toHaveBeenCalledWith('my-token');
    });

    it('should call loggedStoreService.setLogged(true) on success', () => {
      service.loginUser(loginDto).subscribe();
      httpMock.expectOne(`${API_URL}/login`).flush('my-token');
      expect(mockLoggedStore.setLogged).toHaveBeenCalledWith(true);
    });

    it('should call toastService.showSuccess on success', () => {
      service.loginUser(loginDto).subscribe();
      httpMock.expectOne(`${API_URL}/login`).flush('my-token');
      expect(mockToastService.showSuccess).toHaveBeenCalledTimes(1);
    });

    it('should call tokenStoreService.updateToken(null) on error', () => {
      service.loginUser(loginDto).subscribe({ error: () => {} });
      httpMock.expectOne(`${API_URL}/login`).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(mockTokenStore.updateToken).toHaveBeenCalledWith(null);
    });

    it('should call loggedStoreService.setLogged(false) on error', () => {
      service.loginUser(loginDto).subscribe({ error: () => {} });
      httpMock.expectOne(`${API_URL}/login`).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(mockLoggedStore.setLogged).toHaveBeenCalledWith(false);
    });

    it('should call toastService.showError on error', () => {
      service.loginUser(loginDto).subscribe({ error: () => {} });
      httpMock.expectOne(`${API_URL}/login`).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(mockToastService.showError).toHaveBeenCalledTimes(1);
    });

    it('should rethrow the error so subscribers receive it', () => {
      const errors: any[] = [];
      service.loginUser(loginDto).subscribe({ error: (e) => errors.push(e) });
      httpMock.expectOne(`${API_URL}/login`).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(errors).toHaveLength(1);
      expect(errors[0].status).toBe(401);
    });
  });

  describe('logoutUser()', () => {
    it('should DELETE to the correct URL', () => {
      service.logoutUser().subscribe();
      const req = httpMock.expectOne(`${API_URL}/logout`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should send withCredentials', () => {
      service.logoutUser().subscribe();
      const req = httpMock.expectOne(`${API_URL}/logout`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(null);
    });

    it('should call userStoreService.cleanStore on success', () => {
      service.logoutUser().subscribe();
      httpMock.expectOne(`${API_URL}/logout`).flush(null);
      expect(mockUserStore.cleanStore).toHaveBeenCalledTimes(1);
    });

    it('should call loggedStoreService.setLogged(false) on success', () => {
      service.logoutUser().subscribe();
      httpMock.expectOne(`${API_URL}/logout`).flush(null);
      expect(mockLoggedStore.setLogged).toHaveBeenCalledWith(false);
    });

    it('should call tokenStoreService.updateToken(null) on success', () => {
      service.logoutUser().subscribe();
      httpMock.expectOne(`${API_URL}/logout`).flush(null);
      expect(mockTokenStore.updateToken).toHaveBeenCalledWith(null);
    });

    it('should call toastService.showSuccess on success', () => {
      service.logoutUser().subscribe();
      httpMock.expectOne(`${API_URL}/logout`).flush(null);
      expect(mockToastService.showSuccess).toHaveBeenCalledTimes(1);
    });

    it('should call userStoreService.cleanStore on error', () => {
      service.logoutUser().subscribe();
      httpMock.expectOne(`${API_URL}/logout`).flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      expect(mockUserStore.cleanStore).toHaveBeenCalledTimes(1);
    });

    it('should call loggedStoreService.setLogged(false) on error', () => {
      service.logoutUser().subscribe();
      httpMock.expectOne(`${API_URL}/logout`).flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      expect(mockLoggedStore.setLogged).toHaveBeenCalledWith(false);
    });

    it('should call tokenStoreService.updateToken(null) on error', () => {
      service.logoutUser().subscribe();
      httpMock.expectOne(`${API_URL}/logout`).flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      expect(mockTokenStore.updateToken).toHaveBeenCalledWith(null);
    });

    it('should swallow the error — subscriber does not receive it', () => {
      const errors: any[] = [];
      service.logoutUser().subscribe({ error: (e) => errors.push(e) });
      httpMock.expectOne(`${API_URL}/logout`).flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
      expect(errors).toHaveLength(0);
    });
  });

  describe('verify()', () => {
    it('should GET to the correct URL', () => {
      service.verify().subscribe();
      const req = httpMock.expectOne(`${API_URL}/verify`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should send withCredentials', () => {
      service.verify().subscribe();
      const req = httpMock.expectOne(`${API_URL}/verify`);
      expect(req.request.withCredentials).toBe(true);
      req.flush(true);
    });

    it('should call loggedStoreService.setLogged(true) on success', () => {
      service.verify().subscribe();
      httpMock.expectOne(`${API_URL}/verify`).flush(true);
      expect(mockLoggedStore.setLogged).toHaveBeenCalledWith(true);
    });

    it('should call loggedStoreService.setLogged(false) on error', () => {
      service.verify().subscribe();
      httpMock.expectOne(`${API_URL}/verify`).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(mockLoggedStore.setLogged).toHaveBeenCalledWith(false);
    });

    it('should swallow the error — subscriber does not receive it', () => {
      const errors: any[] = [];
      service.verify().subscribe({ error: (e) => errors.push(e) });
      httpMock.expectOne(`${API_URL}/verify`).flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(errors).toHaveLength(0);
    });
  });
});
