import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {AuthService} from '../../services/auth.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService> = {
    loginUser: jest.fn().mockReturnValue(of()),
  } as unknown as jest.Mocked<AuthService>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        {provide: AuthService, useValue: mockAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be valid if forms is valid', () => {
    component.loginForm.setValue({
      userName:  'baxter5xl',
      password: 'uFwOSLzo42gJJjhwbTuG0k1'
    })
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should be invalid if forms is invalid', () => {
    component.loginForm.setValue({
      userName:  'baxter5xl',
      password: ''
    })
    expect(component.loginForm.valid).toBeFalsy();
  })

  it('should call loginUser method once', () => {

    component.loginUser();
    expect(mockAuthService.loginUser).toHaveBeenCalled();
    expect(mockAuthService.loginUser).toHaveBeenCalledTimes(1);
  })

  afterEach(() => {
   jest.clearAllMocks();
  })

});
