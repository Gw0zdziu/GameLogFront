import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UserStore } from '../../../../core/store/user-store/user-store';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let ngForm: NgForm;

  const authServiceMock = { loginUser: jest.fn() };
  const userStoreMock = { getUser: jest.fn() };

  beforeEach(async () => {
    authServiceMock.loginUser.mockReturnValue(of('token'));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserStore, useValue: userStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    await fixture.whenStable();

    ngForm = fixture.debugElement.query(By.css('form')).injector.get(NgForm);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isLogin signal', () => {
    it('should start as false', () => {
      expect(component.isLogin()).toBe(false);
    });

    it('should be true during active login request', async () => {
      const loginSubject = new Subject<string>();
      authServiceMock.loginUser.mockReturnValue(loginSubject.asObservable());

      ngForm.controls['username'].setValue('user1');
      ngForm.controls['password'].setValue('pass1');
      fixture.detectChanges();
      await fixture.whenStable();

      component.loginUser(ngForm);

      expect(component.isLogin()).toBe(true);
      loginSubject.complete();
    });
  });

  describe('loginUser()', () => {
    describe('when form is invalid', () => {
      it('should not call authService.loginUser when fields are empty', () => {
        component.loginUser(ngForm);
        expect(authServiceMock.loginUser).not.toHaveBeenCalled();
      });
    });

    describe('when form is valid', () => {
      beforeEach(async () => {
        ngForm.controls['username'].setValue('baxter5xl');
        ngForm.controls['password'].setValue('secret123');
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it('should call authService.loginUser with correct credentials', () => {
        component.loginUser(ngForm);
        expect(authServiceMock.loginUser).toHaveBeenCalledWith({
          username: 'baxter5xl',
          password: 'secret123',
        });
      });

      it('should call authService.loginUser exactly once', () => {
        component.loginUser(ngForm);
        expect(authServiceMock.loginUser).toHaveBeenCalledTimes(1);
      });

      it('should call userStore.getUser after loginUser succeeds', () => {
        component.loginUser(ngForm);
        expect(userStoreMock.getUser).toHaveBeenCalledTimes(1);
      });

      it('should navigate to home on success', () => {
        component.loginUser(ngForm);
        expect(router.navigate).toHaveBeenCalledWith(['home']);
      });

      it('should set isLogin to false after successful login', async () => {
        component.loginUser(ngForm);
        await fixture.whenStable();
        expect(component.isLogin()).toBe(false);
      });

      it('should set isLogin to false on error', () => {
        authServiceMock.loginUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
        component.loginUser(ngForm);
        expect(component.isLogin()).toBe(false);
      });

      it('should not call userStore.getUser when loginUser fails', () => {
        authServiceMock.loginUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
        component.loginUser(ngForm);
        expect(userStoreMock.getUser).not.toHaveBeenCalled();
      });

      it('should not navigate when loginUser fails', () => {
        authServiceMock.loginUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
        component.loginUser(ngForm);
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
