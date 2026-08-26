import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmAccountComponent} from './confirm-account.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {of, throwError} from 'rxjs';
import {ViewContainerRef} from '@angular/core';

describe('ConfirmAccountComponent', () => {
  const mockUserId = '123456';
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;
  type mockRouterType = Pick<Router, 'navigate'>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: mockRouterType;
  let mockViewContainerRef: jest.Mocked<Partial<ViewContainerRef>>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    }
    mockUserService ={
      confirmUser: jest.fn(),
      resendConfirmationCode: jest.fn()
    } as unknown as jest.Mocked<UserService>;
    mockViewContainerRef = {
      clear: jest.fn()
    }
    await TestBed.configureTestingModule({
      imports: [ConfirmAccountComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: {
                get: () => mockUserId
              }
            }
          }
        },
        {
          provide: Router, useValue: mockRouter
        },
        {
          provide: UserService, useValue: mockUserService
        },
        {
          provide: ViewContainerRef , useValue: mockViewContainerRef
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should assign value to userId', () => {
      component.ngOnInit();
      expect(component.userId).toBe(mockUserId);
    })
  })

  describe('submit()', () => {

    it('should call confirmUser method from UserService', () => {
      mockUserService.confirmUser.mockReturnValue(of(void 0));
      component.otpInputControl.setValue('8373');
      component.submit();
      expect(mockUserService.confirmUser).toHaveBeenCalledTimes(1);
    })

    it('should don`t call confirmUser when otpInputControl is empty', () => {
      mockUserService.confirmUser.mockReturnValue(of(void 0));
      component.otpInputControl.setValue('');
      component.submit();
      expect(mockUserService.confirmUser).toHaveBeenCalledTimes(0)
    });

    it('should change isSubmit on false when successful method', () => {
      mockUserService.confirmUser.mockReturnValue(of(void 0));
      component.otpInputControl.setValue('8373');
      component.submit();
      mockUserService.confirmUser(component.userId, component.otpInputControl.value as string).subscribe(() => {
        expect(component.isSubmit()).toBeFalsy();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      })
    });

    it('should change isSubmit when method return error', () => {
      mockUserService.confirmUser.mockReturnValue(throwError(() => new Error('Error')));
      component.otpInputControl.setValue('8373');
      component.submit();
      expect(component.isSubmit()).toBeFalsy();
    });
  })

  describe('resendCode()', () => {
    it('should call resendConfirmationCode method from UserService', () => {
      mockUserService.resendConfirmationCode.mockReturnValue(of());
      component.resendCode();
      expect(mockUserService.resendConfirmationCode).toHaveBeenCalledTimes(1);
    })

    it('should clear components from viewContainer', () => {
      mockUserService.resendConfirmationCode.mockReturnValue(of(void 0));
      component.resendCode();
      mockUserService.resendConfirmationCode(component.userId).subscribe(() => {
        expect(mockViewContainerRef.clear).toHaveBeenCalledTimes(1);
      })
    });

    it('should call createResendCodeButton method', () => {
      mockUserService.resendConfirmationCode.mockReturnValue(of(void 0));
      component.resendCode();
      mockUserService.resendConfirmationCode(component.userId).subscribe(() => {
        expect(component.createResendCodeButton).toHaveBeenCalledTimes(1);
      })
    });

  })
});
