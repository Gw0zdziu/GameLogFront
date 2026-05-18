import {TestBed} from '@angular/core/testing';
import {CanActivateFn, Router} from '@angular/router';
import {signal, WritableSignal} from '@angular/core';
import {authGuard} from './auth.guard';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import Mocked = jest.Mocked;

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let isLoggedSignal: WritableSignal<boolean | null>;
  let loggedStoreServiceMock: Mocked<Partial<LoggedStoreService>>;
  let routerMock: Mocked<Partial<Router>>;

  beforeEach(() => {
    isLoggedSignal = signal<boolean | null>(false);
    loggedStoreServiceMock = {
      isLogged$: isLoggedSignal.asReadonly(),
    };
    routerMock = {
      navigate: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {provide: LoggedStoreService, useValue: loggedStoreServiceMock},
        {provide: Router, useValue: routerMock},
      ],
    });
  });

  it('should return true when user is logged in', () => {
    isLoggedSignal.set(true);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should return false when user is not logged in', () => {
    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(false);
  });

 
});
