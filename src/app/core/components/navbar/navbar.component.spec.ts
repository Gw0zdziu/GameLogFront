import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavbarComponent} from './navbar.component';
import {AuthService} from '../../../features/auth/services/auth.service';
import {of} from 'rxjs';
import {signal, WritableSignal} from '@angular/core';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {Router} from '@angular/router';
import {LayoutService} from '../../../shared/services/layout/layout.service';
import Mocked = jest.Mocked;

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: Mocked<Partial<AuthService>>;
  let isLoggedSignalMock: WritableSignal<boolean>;
  let loggedStoreServiceMock: Mocked<Partial<LoggedStoreService>>;
  let layoutServiceMock: Mocked<Partial<LayoutService>>;
  let routerMock: Mocked<Partial<Router>>;


  beforeEach(async () => {
    authServiceMock = {
      logoutUser: jest.fn().mockReturnValue(of(null))
    } as unknown as AuthService;
    isLoggedSignalMock = signal(false);
    loggedStoreServiceMock = {
      isLogged$: isLoggedSignalMock.asReadonly(),
      setLogged: jest.fn((value) => isLoggedSignalMock.set(value)),
    };
    routerMock = {
      navigate: jest.fn().mockResolvedValue(true)
    };
    layoutServiceMock = {
      toggleMenu: jest.fn().mockReturnValue(() => null)
    }
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: LoggedStoreService, useValue: loggedStoreServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should items variable return 1 item when isLogged$ is true', () => {
    loggedStoreServiceMock.setLogged?.(true);
    fixture.detectChanges();
    expect(component.items().length).toBe(1);
  });

  it('should items variable return 2 item when isLogged$ is false', () => {
    fixture.detectChanges();
    expect(component.items().length).toBe(2);
  });

  it('should call logoutUser and navigate when command is invoked', () => {
    loggedStoreServiceMock.setLogged?.(true);
    fixture.detectChanges();
    const logoutItem = component.items()[0] as { command: () => void };
    logoutItem.command();
    expect(authServiceMock.logoutUser).toHaveBeenCalled();
  });

  it('should call toggleMenu in layoutService when toggleMenu is invoked', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(layoutServiceMock.toggleMenu).toHaveBeenCalled()
  })

});
