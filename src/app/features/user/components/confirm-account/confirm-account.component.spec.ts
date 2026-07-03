import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmAccountComponent} from './confirm-account.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {of} from 'rxjs';

describe('ConfirmAccountComponent', () => {
  const mockUserId = '123456';
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;
  type mockUserServiceType = Pick<UserService, 'confirmUser' | 'resendConfirmationCode'>
  type mockRouterType = Pick<Router, 'navigate'>;
  let mockUserService: mockUserServiceType;
  let mockRouter: mockRouterType;

  beforeEach(async () => {
    mockUserService =  {
      confirmUser: jest.fn().mockReturnValue(of(void 0)),
      resendConfirmationCode: jest.fn().mockReturnValue(of())
    }
    mockRouter = {
      navigate: jest.fn()
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
      component.otpInputControl.setValue('8373');
      component.submit();
      expect(mockUserService.confirmUser).toHaveBeenCalledTimes(1);
    })

    it('should don`t call confirmUser when otpInputControl is empty', () => {
      component.otpInputControl.setValue('');
      component.submit();
      expect(mockUserService.confirmUser).toHaveBeenCalledTimes(0)
    });

    it('should change isSubmit on false when successful method', () => {
      component.otpInputControl.setValue('8373');
      component.submit();
      mockUserService.confirmUser(component.userId, component.otpInputControl.value as string).subscribe(x => {
        expect(component.isSubmit()).toBeFalsy();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      })
    });
  })


});
