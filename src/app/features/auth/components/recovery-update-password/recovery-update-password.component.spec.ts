import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecoveryUpdatePasswordComponent} from './recovery-update-password.component';
import {UserService} from '../../../user/services/user.service';
import {of} from 'rxjs';
import {ActivatedRoute, convertToParamMap} from '@angular/router';

describe('RecoveryUpdatePasswordComponent', () => {
  let component: RecoveryUpdatePasswordComponent;
  let fixture: ComponentFixture<RecoveryUpdatePasswordComponent>;
  let mockUserService: jest.Mocked<UserService> = {
    recoveryUpdatePassword: jest.fn().mockReturnValue(of()),
  } as unknown as jest.Mocked<UserService>
  const password= 'uFwOSLzo42gJJjhwbTuG0k1';
  const confirmPassword= 'uFwOSLzo42gJJjhwbTuG0k1';
  const badConfirmPassword= 'LcyavmWL5gU';
  const userId= '1';
  const token= 'cfda09f2-1dde-402e-9fef-12efdffde57d';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryUpdatePasswordComponent, ],
      providers: [
        {
        provide: UserService,
        useValue: mockUserService
      },
        {
          provide: ActivatedRoute,
          useValue:{
            queryParamMap: of(convertToParamMap({token: token, id: userId})),
          }
        }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryUpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should form is valid if controls are valid', () => {
    component.newPasswordForm.setValue({
      password: password,
      confirmPassword: confirmPassword
    })
    expect(component.newPasswordForm.valid).toBeTruthy();
  });

  it('should form is invalid when controls is invalid', () => {
    component.newPasswordForm.setValue({
      password: '',
      confirmPassword: ''
    })
    expect(component.newPasswordForm.valid).toBeFalsy();
  });

  it('should get token and id from route', () => {
    expect(component.recoveryUpdatePassword).toEqual({
      token: token,
      userId: userId
    })
  });

  it('should recoveryUpdatePassword contain all data when call a method', () => {
    component.newPasswordForm.setValue({
      password: password,
      confirmPassword: confirmPassword
    })
    component.postRecoveryUpdatePassword();
    expect(component.recoveryUpdatePassword).toEqual({
      userId: userId,
      newPassword: password,
      confirmPassword: confirmPassword,
      token: token,
    });
  });

  it('should called api method', () => {
    component.postRecoveryUpdatePassword();
    expect(mockUserService.recoveryUpdatePassword).toHaveBeenCalled();
    expect(mockUserService.recoveryUpdatePassword).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});
