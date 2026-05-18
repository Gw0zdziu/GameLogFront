# Advanced Jest Patterns

## localstorage mock — setup-jest.ts (globalny)

Dodaj do `setup-jest.ts` żeby działało we wszystkich testach bez powtarzania:

```ts
// setup-jest.ts
import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Reset między testami
beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});
```

---

## OnPush component + signals

Sygnały nie triggerują `@angular/core/testing` fixture automatycznie — wymuś detekcję:

```ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { UserStoreService } from '../stores/user-store.service';
import { signal } from '@angular/core';

describe('UserCardComponent (OnPush)', () => {
  let fixture: ComponentFixture<UserCardComponent>;
  const mockUser = signal<{ email: string } | null>(null);
  const userStoreMock = { user$: mockUser, cleanStore: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [{ provide: UserStoreService, useValue: userStoreMock }],
    });
    fixture = TestBed.createComponent(UserCardComponent);
    fixture.detectChanges();
  });

  it('aktualizuje widok gdy sygnał się zmienia', () => {
    mockUser.set({ email: 'jan@test.pl' });
    fixture.detectChanges(); // wymagane dla OnPush
    expect(fixture.nativeElement.querySelector('[data-testid="email"]').textContent)
      .toContain('jan@test.pl');
  });
});
```

---

## ActivatedRoute mock

```ts
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

const activatedRouteMock = {
  snapshot: {
    paramMap: { get: (key: string) => key === 'id' ? '42' : null },
    queryParams: {},
  },
  params: of({ id: '42' }),
  queryParams: of({}),
  data: of({}),
};

TestBed.configureTestingModule({
  providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
});
```

---

## Resolver testing

```ts
// user.resolver.spec.ts
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { of } from 'rxjs';
import { userResolver } from './user.resolver';
import { ApiService } from '../services/api.service';

describe('userResolver', () => {
  const apiServiceMock = {
    getUser: jest.fn().mockReturnValue(of({ id: '1', email: 'jan@test.pl' })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiServiceMock }],
    });
  });

  it('zwraca usera z serwisu', async () => {
    const route = { paramMap: { get: () => '1' } } as unknown as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(userResolver(route, {} as any))
    );

    expect(result).toMatchObject({ id: '1', email: 'jan@test.pl' });
  });
});
```

---

## Interceptor testing

```ts
// auth.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { UserStoreService } from '../stores/user-store.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const mockUser = signal<{ token: string } | null>({ token: 'abc123' });
  const userStoreMock = { user$: mockUser };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: UserStoreService, useValue: userStoreMock },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('dodaje Authorization header', () => {
    http.get('/api/data').subscribe();
    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('nie dodaje headera gdy user jest null', () => {
    mockUser.set(null);
    http.get('/api/data').subscribe();
    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
```

---

## Directive testing

```ts
// highlight.directive.spec.ts
import { render, screen } from '@testing-library/angular';
import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';

@Component({
  standalone: true,
  imports: [HighlightDirective],
  template: `<p appHighlight color="yellow" data-testid="el">Test</p>`,
})
class TestHostComponent {}

describe('HighlightDirective', () => {
  it('aplikuje kolor tła', async () => {
    await render(TestHostComponent);
    expect(screen.getByTestId('el').style.backgroundColor).toBe('yellow');
  });
});
```

---

## Typowe błędy

| Błąd                                                    | Przyczyna                         | Fix                                                           |
|---------------------------------------------------------|-----------------------------------|---------------------------------------------------------------|
| `effect() can only be used within an injection context` | `effect()` poza `TestBed`         | Użyj `TestBed.runInInjectionContext(() => ...)`               |
| `signal changes not reflected in template`              | Brak `detectChanges()` dla OnPush | Wywołaj `fixture.detectChanges()` po zmianie sygnału          |
| `localStorage is not defined`                           | Brak mocka                        | Dodaj mock w `setup-jest.ts`                                  |
| `NullInjectorError: No provider for UserStoreService`   | Brak providera w TestBed          | Dodaj `{ provide: UserStoreService, useValue: mock }`         |
| `ExpressionChangedAfterItHasBeenCheckedError`           | Zmiana stanu po detekcji          | Wywołaj `fixture.detectChanges()` ponownie                    |
| HTTP request not flushed                                | Brak `req.flush()`                | Każdy request musi być obsłużony lub użyj `httpMock.verify()` |
