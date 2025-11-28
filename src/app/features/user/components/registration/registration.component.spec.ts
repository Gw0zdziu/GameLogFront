import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationComponent} from './registration.component';
import {UserService} from '../../services/user.service';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let mockUserService: jest.Mocked<UserService> = {
    registerNewUser: jest.fn().mockReturnValue(of()),
  } as unknown as jest.Mocked<UserService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent, RouterTestingModule],
      providers: [
        {provide: UserService, useValue: mockUserService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should form is valid, when control is valid', () => {
    component.registerForm.setValue({
      userName: 'kateriaqn',
      firstname: 'Leo',
      lastname: 'Cohan',
      userEmail: 'lakrisha_gaunamv@disability.rm',
      password: 'dhiC8jEk61qsK4WMQao',
      confirmPassword: 'dhiC8jEk61qsK4WMQao'
    })
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should form is invalid, when length and email format is invalid ', () => {
    component.registerForm.setValue({
      userName: 'ka',
      firstname: 'ka',
      lastname: 'ka',
      userEmail: 'gggg@',
      password: 'pass',
      confirmPassword: 'pass',
    })
    expect(component.registerForm.controls.userName.hasError('minlength')).toBeTruthy();
    expect(component.registerForm.controls.firstname.hasError('minlength')).toBeTruthy();
    expect(component.registerForm.controls.lastname.hasError('minlength')).toBeTruthy();
    expect(component.registerForm.controls.userEmail.hasError('email')).toBeTruthy();
    expect(component.registerForm.controls.password.hasError('minlength')).toBeTruthy();
    expect(component.registerForm.controls.confirmPassword.hasError('minlength')).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();
  })

  it('should form is invalid, when control is empty', () => {
    component.registerForm.setValue({
      userName: '',
      firstname: '',
      lastname: '',
      userEmail: '',
      password: '',
      confirmPassword: '',
    })
    expect(component.registerForm.controls.userName.hasError('required')).toBeTruthy();
    expect(component.registerForm.controls.firstname.hasError('required')).toBeTruthy();
    expect(component.registerForm.controls.lastname.hasError('required')).toBeTruthy();
    expect(component.registerForm.controls.userEmail.hasError('required')).toBeTruthy();
    expect(component.registerForm.controls.password.hasError('required')).toBeTruthy();
    expect(component.registerForm.controls.confirmPassword.hasError('required')).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should call to api method once when call to postNewUser', () => {
    component.postNewUser();
    expect(mockUserService.registerNewUser).toHaveBeenCalled();
    expect(mockUserService.registerNewUser).toHaveBeenCalledTimes(1)
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});
