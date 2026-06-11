import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { LoggedStoreService } from '../../../core/store/logged-store/logged-store.service';
import { GetUserDto } from '../../../shared/models/get-user.dto';
import { RegisterNewUserRequestDto } from '../models/register-new-user-request.dto';
import { IS_AUTH_REQUIRED } from '../../../core/tokens/tokens';

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

    it('wysyła POST na /user/register z danymi rejestracji', () => {
      service.registerNewUser(registerDto).subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerDto);
      req.flush('ok');
    });

    it('zwraca wartość tekstową po sukcesie', () => {
      let result: string | undefined;
      service.registerNewUser(registerDto).subscribe(val => (result = val));

      httpMock.expectOne('https://localhost:8080/api/user/register').flush('ok');
      expect(result).toBe('ok');
    });

    it('wywołuje toastService.showSuccess po sukcesie', () => {
      service.registerNewUser(registerDto).subscribe();

      httpMock.expectOne('https://localhost:8080/api/user/register').flush('ok');
      expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('Udało się założyć konto');
    });

    it('wywołuje toastService.showError gdy request się nie powiedzie', () => {
      service.registerNewUser(registerDto).subscribe({ error: () => {} });

      httpMock.expectOne('https://localhost:8080/api/user/register').flush('Błąd serwera', {
        status: 400,
        statusText: 'Bad Request',
      });
      expect(toastServiceMock.showError).toHaveBeenCalledWith('Błąd serwera');
    });

    it('rzuca błąd dalej po nieudanym requeście', () => {
      let caughtError: any;
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

    it('wysyła GET na /user/get-user', () => {
      service.getUser().subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/get-user');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('wysyła request z withCredentials: true', () => {
      service.getUser().subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/get-user');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockUser);
    });

    it('ustawia IS_AUTH_REQUIRED context token na true', () => {
      service.getUser().subscribe();

      const req = httpMock.expectOne('https://localhost:8080/api/user/get-user');
      expect(req.request.context.get(IS_AUTH_REQUIRED)).toBe(true);
      req.flush(mockUser);
    });

    it('zwraca dane użytkownika', () => {
      let result: GetUserDto | undefined;
      service.getUser().subscribe(data => (result = data));

      httpMock.expectOne('https://localhost:8080/api/user/get-user').flush(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
