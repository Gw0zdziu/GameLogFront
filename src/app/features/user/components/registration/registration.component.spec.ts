import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegistrationComponent } from './registration.component';
import { UserService } from '../../services/user.service';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let mockUserService: jest.Mocked<Pick<UserService, 'registerNewUser'>>;

  beforeEach(async () => {
    mockUserService = {
      registerNewUser: jest.fn().mockReturnValue(of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('registerForm validation', () => {
    it('should be valid when all controls are filled correctly', () => {
      component.registerForm.setValue({
        userName: 'kateriaqn',
        firstname: 'Leo',
        lastname: 'Cohan',
        userEmail: 'lakrisha_gaunamv@disability.rm',
        password: 'dhiC8jEk61qsK4WMQao',
        confirmPassword: 'dhiC8jEk61qsK4WMQao',
        invitationCode: null,
      });
      expect(component.registerForm.valid).toBeTruthy();
    });

    it('should be invalid when fields are too short and email format is wrong', () => {
      component.registerForm.setValue({
        userName: 'ka',
        firstname: 'ka',
        lastname: 'ka',
        userEmail: 'gggg@',
        password: 'pass',
        confirmPassword: 'pass',
        invitationCode: null,
      });
      expect(component.registerForm.controls.userName.hasError('minlength')).toBeTruthy();
      expect(component.registerForm.controls.firstname.hasError('minlength')).toBeTruthy();
      expect(component.registerForm.controls.lastname.hasError('minlength')).toBeTruthy();
      expect(component.registerForm.controls.userEmail.hasError('email')).toBeTruthy();
      expect(component.registerForm.controls.password.hasError('minlength')).toBeTruthy();
      expect(component.registerForm.controls.confirmPassword.hasError('minlength')).toBeTruthy();
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should be invalid when required fields are empty', () => {
      component.registerForm.setValue({
        userName: '',
        firstname: '',
        lastname: '',
        userEmail: '',
        password: '',
        confirmPassword: '',
        invitationCode: null,
      });
      expect(component.registerForm.controls.userName.hasError('required')).toBeTruthy();
      expect(component.registerForm.controls.firstname.hasError('required')).toBeTruthy();
      expect(component.registerForm.controls.lastname.hasError('required')).toBeTruthy();
      expect(component.registerForm.controls.userEmail.hasError('required')).toBeTruthy();
      expect(component.registerForm.controls.password.hasError('required')).toBeTruthy();
      expect(component.registerForm.controls.confirmPassword.hasError('required')).toBeTruthy();
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should set mustMatch error on confirmPassword when passwords do not match', () => {
      component.registerForm.setValue({
        userName: 'kateriaqn',
        firstname: 'Leo',
        lastname: 'Cohan',
        userEmail: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
        invitationCode: null,
      });
      expect(component.registerForm.controls.confirmPassword.hasError('mustMatch')).toBeTruthy();
      expect(component.registerForm.valid).toBeFalsy();
    });
  });

  describe('postNewUser()', () => {
    let navigateSpy: jest.SpyInstance;

    beforeEach(() => {
      navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    });

    it('should call registerNewUser once', () => {
      component.postNewUser();
      expect(mockUserService.registerNewUser).toHaveBeenCalledTimes(1);
    });

    it('should set isSubmit to true while request is in flight', fakeAsync(() => {
      component.postNewUser();
      expect(component.isSubmit()).toBe(true);
      tick(500);
    }));

    it('should set isSubmit to false and navigate after successful registration', fakeAsync(() => {
      component.postNewUser();
      tick(500);
      expect(component.isSubmit()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['login']);
    }));

    it('should set isSubmit to false when api returns error', fakeAsync(() => {
      mockUserService.registerNewUser.mockReturnValue(throwError(() => new Error('error')));
      component.postNewUser();
      tick(500);
      expect(component.isSubmit()).toBe(false);
    }));
  });
});
