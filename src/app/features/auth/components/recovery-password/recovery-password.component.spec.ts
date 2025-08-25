import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecoveryPasswordComponent} from './recovery-password.component';
import {UserService} from '../../../user/services/user.service';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('RecoveryPasswordComponent', () => {
  let component: RecoveryPasswordComponent;
  let fixture: ComponentFixture<RecoveryPasswordComponent>;
  let mockUserService: jest.Mocked<UserService> = {
    recoveryPassword: jest.fn().mockReturnValue(of()),
  } as unknown as jest.Mocked<UserService>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPasswordComponent, RouterTestingModule],
      providers: [
        {provide: UserService, useValue: mockUserService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should control be valid if value is valid', () => {
    component.userEmail.setValue('aleisa_chichesterh2uz@legend.rac');
    expect(component.userEmail.valid).toBeTruthy();
  });

  it('should control be invalid if value is not email', () => {
    component.userEmail.setValue('aleisa_chichesterh2uz');
    expect(component.userEmail.valid).toBeFalsy();
  });

  it('should call recoveryPassword method', () => {
    component.postRecoveryPassword();
    expect(mockUserService.recoveryPassword).toHaveBeenCalled();
    expect(mockUserService.recoveryPassword).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});
