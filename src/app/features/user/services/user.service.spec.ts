import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {UserService} from './user.service';
import {ToastService} from '../../../shared/services/toast/toast.service';
import {LoggedStoreService} from '../../../core/store/logged-store/logged-store.service';
import {GetUserDto} from '../../../shared/models/get-user.dto';
import {RegisterNewUserRequestDto} from '../models/register-new-user-request.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const toastServiceMock = {
    showSuccess: jest.fn(),
    showError: jest.fn(),
  };

  const loggedStoreMock = {
    isLogged$: jest.fn(),
    setLogged: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: toastServiceMock },
        { provide: LoggedStoreService, useValue: loggedStoreMock },
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerNewUser()', () => {
    const registerDto: RegisterNewUserRequestDto = {
      userName: 'testuser',
      firstname: 'Jan',
      lastname: 'Kowalski',
      userEmail: 'jan@test.pl',
      password: 'secret123',
      invitationCode: null,
    };

    it('sends a POST request to /user/register with the registration details', () => {
      service.registerNewUser(registerDto).subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerDto);
      req.flush('ok');
    });

    it('returns a text value on success', () => {
      let result: string | undefined;
      service.registerNewUser(registerDto).subscribe(val => (result = val));

      httpMock.expectOne('https://localhost:8080/api/user/register').flush('ok');
      expect(result).toBe('ok');
    });

    it('calls toastService.showSuccess on success', () => {
      service.registerNewUser(registerDto).subscribe();

      httpMock.expectOne('https://localhost:8080/api/user/register').flush('ok');
      expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Udało się założyć konto');
    });

    it('calls `toastService.showError` when the request fails', () => {
      service.registerNewUser(registerDto).subscribe({ error: () => {} });

      httpMock.expectOne('https://localhost:8080/api/user/register').flush('Błąd serwera', {
        status: 400,
        statusText: 'Bad Request',
      });
      expect(toastServiceMock.showError).toHaveBeenCalledWith('Błąd serwera');
    });

    it('throws an error after a failed query', () => {
      let caughtError: HttpErrorResponse | undefined;
      service.registerNewUser(registerDto).subscribe({ error: err => (caughtError = err) });

      httpMock.expectOne('https://localhost:8080/api/user/register').flush('Błąd serwera', {
        status: 400,
        statusText: 'Bad Request',
      });
      expect(caughtError).toBeDefined();
    });
  });

  describe('getUser()', () => {
    const mockUser: GetUserDto = {
      userId: '1',
      userName: 'testuser',
      firstName: 'Jan',
      lastName: 'Kowalski',
      userEmail: 'jan@test.pl',
      isActive: true,
    };

    it('sends a GET request to /user/get-user', () => {
      service.getUser().subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/get-user');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('sends a request with `withCredentials: true`', () => {
      service.getUser().subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/get-user');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockUser);
    });

    it('set IS_AUTH_REQUIRED context token on true', () => {
      service.getUser().subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/get-user');
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(mockUser);
    });

    it('returns the user’s data', () => {
      let result: GetUserDto | undefined;
      service.getUser().subscribe(data => (result = data));

      httpMock.expectOne('https://localhost:8080/api/user/get-user').flush(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('confirmUser', () => {
    const userId = '1';
    const confirmCode = '1245'

    it('sends a POST request to /user/confirm-user', () => {
      service.confirmUser(userId, confirmCode).subscribe();
      const request  = httpMock.expectOne('https://localhost:8080/api/user/confirm-user');
      expect(request.request.method).toBe('POST');
      request.flush('ok');
    })

    it('should calls showError method from toastService', () => {
      const errorMessage = 'Błąd serwera'
      service.confirmUser(userId, confirmCode).subscribe({ error: () => {} });
      httpMock.expectOne('https://localhost:8080/api/user/confirm-user').flush(errorMessage, {
        status: 400,
        statusText: 'Bad Request',
      })
      expect(toastServiceMock.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('resendConfirmationCode()', () => {
    const userId = '1';

    it('sends a POST request to /user/resend-code', () => {
      service.resendConfirmationCode(userId).subscribe();
      const request  = httpMock.expectOne(`https://localhost:8080/api/user/resend-code/${userId}`);
      expect(request.request.method).toBe('GET');
      request.flush('ok');
    })

    it('should calls showError method from toastService', () => {
      const errorMessage = 'Błąd serwera'
      service.resendConfirmationCode(userId).subscribe({ error: () => {} });
      httpMock.expectOne(`https://localhost:8080/api/user/resend-code/${userId}`).flush(errorMessage, {
        status: 400,
        statusText: 'Bad Request',
      })
      expect(toastServiceMock.showError).toHaveBeenCalledWith(errorMessage)
    })
  });
});
