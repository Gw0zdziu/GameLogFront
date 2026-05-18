---
name: angular-jest-testing
description: >
  Unit testing Angular 19 project with Jest and jest-preset-angular.
  Covers: signal store services (UserStoreService pattern with localStorage + effect),
  components with @testing-library/angular, HTTP services with provideHttpClientTesting,
  functional guards with TestBed.runInInjectionContext, NgRx SignalStore, pipes, directives.
  Trigger for: "napisz testy", "przetestuj", "jak testować", "write tests", "fix my tests",
  whenever user pastes a service/component/guard and asks to test it.
---

# Angular 19 Unit Testing — Project Guide

Stack: Angular 19, jest-preset-angular, @testing-library/angular, signals, NgRx SignalStore.
Advanced patterns → `references/jest-patterns.md`

---

## CRITICAL: localStorage mock

**Każdy plik testowy** który importuje serwis używający `localStorage` musi mockować storage.
Rób to w `beforeEach`, nigdy nie używaj prawdziwego `localStorage` w testach.

```ts
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

Umieść to raz w `setup-jest.ts` żeby działało globalnie — albo per plik w `beforeEach`.

---

## UserStoreService — wzorzec testowania

```ts
// user-store.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { UserStoreService } from './user-store.service';

describe('UserStoreService', () => {
  let service: UserStoreService;

  // Mock localStorage przed każdym testem
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] ?? null),
      setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: jest.fn((key: string) => { delete store[key]; }),
      clear: jest.fn(() => { store = {}; }),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
    localStorageMock.clear();
    jest.clearAllMocks();

    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStoreService);
  });

  describe('inicjalizacja', () => {
    it('ładuje usera z localStorage jeśli istnieje', () => {
      const stored = { id: '1', email: 'jan@test.pl' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(stored));

      // Musimy stworzyć serwis PO ustawieniu mocka
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(UserStoreService);

      expect(freshService.user$()).toEqual(stored);
    });

    it('user$ jest null gdy localStorage pusty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(service.user$()).toBeNull();
    });
  });

  describe('updateUser()', () => {
    it('ustawia usera', () => {
      service.updateUser({ id: '1', email: 'jan@test.pl' });
      expect(service.user$()).toMatchObject({ id: '1', email: 'jan@test.pl' });
    });

    it('merge\'uje dane — nie nadpisuje całego obiektu', () => {
      service.updateUser({ id: '1', email: 'jan@test.pl' });
      service.updateUser({ firstName: 'Jan' });
      expect(service.user$()).toMatchObject({ id: '1', email: 'jan@test.pl', firstName: 'Jan' });
    });

    it('zapisuje do localStorage przez effect', () => {
      service.updateUser({ id: '1', email: 'jan@test.pl' });
      TestBed.flushEffects(); // <-- wymagane dla effect()
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        expect.stringContaining('"email":"jan@test.pl"')
      );
    });
  });

  describe('cleanStore()', () => {
    it('czyści usera', () => {
      service.updateUser({ id: '1' });
      service.cleanStore();
      expect(service.user$()).toBeNull();
    });

    it('usuwa usera z localStorage przez effect', () => {
      service.updateUser({ id: '1' });
      service.cleanStore();
      TestBed.flushEffects(); // <-- wymagane dla effect()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });
});
```

---

## Komponent używający UserStoreService

```ts
// header.component.spec.ts
import { render, screen, fireEvent } from '@testing-library/angular';
import { signal } from '@angular/core';
import { HeaderComponent } from './header.component';
import { UserStoreService } from '../stores/user-store.service';

describe('HeaderComponent', () => {
  // Mock całego UserStoreService
  const mockUser = signal<{ email: string } | null>(null);
  const userStoreMock: Partial<UserStoreService> = {
    user$: mockUser,
    cleanStore: jest.fn(),
    updateUser: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('wyświetla email zalogowanego usera', async () => {
    mockUser.set({ email: 'jan@test.pl' });

    await render(HeaderComponent, {
      providers: [{ provide: UserStoreService, useValue: userStoreMock }],
    });

    expect(screen.getByText('jan@test.pl')).toBeInTheDocument();
  });

  it('wywołuje cleanStore po kliknięciu logout', async () => {
    mockUser.set({ email: 'jan@test.pl' });

    await render(HeaderComponent, {
      providers: [{ provide: UserStoreService, useValue: userStoreMock }],
    });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(userStoreMock.cleanStore).toHaveBeenCalledTimes(1);
  });

  it('nie pokazuje email gdy user jest null', async () => {
    mockUser.set(null);

    await render(HeaderComponent, {
      providers: [{ provide: UserStoreService, useValue: userStoreMock }],
    });

    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });
});
```

---

## HTTP Service

```ts
// api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // sprawdza czy nie zostały niezobsługowane requesty
    jest.clearAllMocks();
  });

  it('pobiera dane', () => {
    const mockData = { id: '1', name: 'Test' };

    service.getData('1').subscribe(data => expect(data).toEqual(mockData));

    const req = httpMock.expectOne('/api/data/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('wysyła token w nagłówku', () => {
    service.getData('1').subscribe();
    const req = httpMock.expectOne('/api/data/1');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    req.flush({});
  });

  it('obsługuje błąd 401', () => {
    service.getData('1').subscribe({
      error: err => expect(err.status).toBe(401),
    });
    httpMock.expectOne('/api/data/1').flush('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });
  });
});
```

---

## Functional Guard

```ts
// auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { UserStoreService } from '../stores/user-store.service';
import { signal } from '@angular/core';

describe('authGuard', () => {
  const mockUser = signal<{ id: string } | null>(null);
  const userStoreMock = { user$: mockUser };
  const routerMock = { navigate: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserStoreService, useValue: userStoreMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    jest.clearAllMocks();
  });

  it('przepuszcza zalogowanego usera', () => {
    mockUser.set({ id: '1' });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('przekierowuje na /login gdy brak usera', () => {
    mockUser.set(null);
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
```

---

## NgRx SignalStore

```ts
// products.store.spec.ts
import { TestBed } from '@angular/core/testing';
import { ProductsStore } from './products.store';
import { ProductsService } from './products.service';
import { of } from 'rxjs';

describe('ProductsStore', () => {
  const productsServiceMock = {
    getAll: jest.fn().mockReturnValue(of([{ id: '1', name: 'Laptop' }])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    });
    jest.clearAllMocks();
  });

  it('ma pusty stan początkowy', () => {
    const store = TestBed.inject(ProductsStore);
    expect(store.products()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('ładuje produkty', async () => {
    const store = TestBed.inject(ProductsStore);
    await store.loadProducts(); // lub store.load() — zależy od implementacji
    expect(store.products()).toHaveLength(1);
    expect(store.products()[0].name).toBe('Laptop');
  });
});
```

---

## Pipe

```ts
// my.pipe.spec.ts
import { MyPipe } from './my.pipe';

describe('MyPipe', () => {
  const pipe = new MyPipe();

  it('transforms value correctly', () => {
    expect(pipe.transform('hello')).toBe('HELLO');
  });

  it('handles null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
```

---

## Rules

- `TestBed.flushEffects()` — zawsze po zmianie sygnału gdy testujesz `effect()`
- `provideHttpClient()` + `provideHttpClientTesting()` — nie `HttpClientTestingModule`
- `TestBed.runInInjectionContext()` — dla guardów i resolverów
- `afterEach(() => httpMock.verify())` — wykrywa niezobsługowane HTTP requesty
- `afterEach(() => jest.clearAllMocks())` — czyść mocki między testami
- Mockuj `localStorage` globalnie w `setup-jest.ts` albo per `beforeEach`
- Mockuj `UserStoreService` przez `signal()` — nie przez plain object z wartością

For more: OnPush, ActivatedRoute, Resolver, Interceptor patterns → `references/jest-patterns.md`
