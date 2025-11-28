import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmAccountComponent} from './confirm-account.component';
import {UserService} from '../../services/user.service';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

describe('ConfirmAccountComponent', () => {
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;
  let mockUserService: jest.Mocked<UserService> = {
    confirmUser: jest.fn().mockReturnValue(of()),
  } as unknown as jest.Mocked<UserService>;
  const userId= '1';
  const confirmCode = '4243';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAccountComponent],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue(userId)
              }
            }
          }
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

  it('should get userId value from route', () => {
    expect(component.userId()).toEqual(userId);
  });

  it('should control is valid when contain value', () => {
    component.confirmCode.setValue(confirmCode);
    expect(component.confirmCode.valid).toBeTruthy();
  });

  it('should control is invalid when contain value', () => {
    expect(component.confirmCode.valid).toBeFalsy();
  });

  it('should confirmCode called, when call postConfirmCode method', () => {
    component.postConfirmCode();
    expect(mockUserService.confirmUser).toHaveBeenCalled();
    expect(mockUserService.confirmUser).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })
});
