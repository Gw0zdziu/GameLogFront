import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../user/services/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const mockAuthService = {
    loginUser: jest.fn(),
  };
  const mockUserService = {
    getUser: jest.fn(),
  };

  beforeEach(async () => {
    mockAuthService.loginUser.mockReturnValue(of('token'));
    mockUserService.getUser.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isLogin signal', () => {
    it('should start as false', () => {
      expect(component.isLogin()).toBe(false);
    });

    it('should be true during active login request', () => {
      const loginSubject = new Subject<string>();
      mockAuthService.loginUser.mockReturnValue(loginSubject.asObservable());
      component.loginForm.setValue({ userName: 'user1', password: 'pass1' });

      component.loginUser();

      expect(component.isLogin()).toBe(true);
      loginSubject.complete();
    });
  });

  describe('loginForm', () => {
    it('should be valid when all fields are filled', () => {
      component.loginForm.setValue({ userName: 'baxter5xl', password: 'secret123' });
      expect(component.loginForm.valid).toBeTruthy();
    });

    it('should be invalid when userName is empty', () => {
      component.loginForm.setValue({ userName: '', password: 'secret123' });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be invalid when password is empty', () => {
      component.loginForm.setValue({ userName: 'baxter5xl', password: '' });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be invalid when both fields are empty', () => {
      component.loginForm.setValue({ userName: '', password: '' });
      expect(component.loginForm.valid).toBeFalsy();
    });
  });

  describe('loginUser()', () => {
    describe('when form is invalid', () => {
      it('should not call authService.loginUser', () => {
        component.loginForm.setValue({ userName: '', password: '' });
        component.loginUser();
        expect(mockAuthService.loginUser).not.toHaveBeenCalled();
      });

      it('should mark userName as touched when userName is empty', () => {
        component.loginForm.setValue({ userName: '', password: 'secret' });
        component.loginUser();
        expect(component.loginForm.controls.userName.touched).toBeTruthy();
      });

      it('should mark password as touched when password is empty', () => {
        component.loginForm.setValue({ userName: 'baxter5xl', password: '' });
        component.loginUser();
        expect(component.loginForm.controls.password.touched).toBeTruthy();
      });

      it('should not mark userName as touched when it has a value', () => {
        component.loginForm.setValue({ userName: 'baxter5xl', password: '' });
        component.loginUser();
        expect(component.loginForm.controls.userName.touched).toBeFalsy();
      });
    });

    describe('when form is valid', () => {
      beforeEach(() => {
        component.loginForm.setValue({ userName: 'baxter5xl', password: 'secret123' });
      });

      it('should call authService.loginUser with correct credentials', () => {
        component.loginUser();
        expect(mockAuthService.loginUser).toHaveBeenCalledWith({
          userName: 'baxter5xl',
          password: 'secret123',
        });
      });

      it('should call authService.loginUser exactly once', () => {
        component.loginUser();
        expect(mockAuthService.loginUser).toHaveBeenCalledTimes(1);
      });

      it('should call userService.getUser after loginUser succeeds', () => {
        component.loginUser();
        expect(mockUserService.getUser).toHaveBeenCalledTimes(1);
      });

      it('should navigate to home on success', () => {
        component.loginUser();
        expect(router.navigate).toHaveBeenCalledWith(['home']);
      });

      it('should set isLogin to false after successful login', () => {
        component.loginUser();
        expect(component.isLogin()).toBe(false);
      });

      it('should set isLogin to false on error', () => {
        mockAuthService.loginUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
        component.loginUser();
        expect(component.isLogin()).toBe(false);
      });

      it('should not call userService.getUser when loginUser fails', () => {
        mockAuthService.loginUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
        component.loginUser();
        expect(mockUserService.getUser).not.toHaveBeenCalled();
      });

      it('should not navigate when loginUser fails', () => {
        mockAuthService.loginUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
        component.loginUser();
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
