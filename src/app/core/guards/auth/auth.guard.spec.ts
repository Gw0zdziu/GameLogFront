import {TestBed} from '@angular/core/testing';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {authGuard} from './auth.guard';
import {AuthService} from '../../../features/auth/services/auth.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const fakeUrlTree = {toString: () => '/login'} as unknown as UrlTree;
  const authServiceMock = {verify: jest.fn()};
  const routerMock = {createUrlTree: jest.fn().mockReturnValue(fakeUrlTree)};

  beforeEach(() => {
    jest.clearAllMocks();
    routerMock.createUrlTree.mockReturnValue(fakeUrlTree);
    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: Router, useValue: routerMock},
      ],
    });
  });

  it('should return true when verify succeeds', (done) => {
    authServiceMock.verify.mockReturnValue(of(true));

    (executeGuard({} as any, {} as any) as Observable<boolean | UrlTree>).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to login when verify throws', (done) => {
    authServiceMock.verify.mockReturnValue(throwError(() => new Error('Unauthorized')));

    (executeGuard({} as any, {} as any) as Observable<boolean | UrlTree>).subscribe((result) => {
      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['login']);
      expect(result).toBe(fakeUrlTree);
      done();
    });
  });
});
