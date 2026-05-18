import {TestBed} from '@angular/core/testing';
import {TokenStoreService} from './token-store.service';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

describe('TokenStoreService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  function createService(): TokenStoreService {
    TestBed.configureTestingModule({});
    return TestBed.inject(TokenStoreService);
  }

  describe('initialization', () => {
    it('reads token from localStorage on creation', () => {
      localStorageMock.getItem.mockReturnValue('stored-token');
      const service = createService();

      expect(service.token$()).toBe('stored-token');
    });

    it('token$ is null when localStorage has no token', () => {
      // @ts-expect-error
      localStorageMock.getItem.mockReturnValue(null);
      const service = createService();

      expect(service.token$()).toBeNull();
    });
  });

  describe('updateToken()', () => {
    it('updates token$ with the new value', () => {
      const service = createService();

      service.updateToken('new-token-abc');

      expect(service.token$()).toBe('new-token-abc');
    });

    it('sets token$ to null when called with null', () => {
      const service = createService();

      service.updateToken(null);

      expect(service.token$()).toBeNull();
    });

    it('saves token to localStorage via effect when token is set', () => {
      const service = createService();

      service.updateToken('saved-token');
      TestBed.flushEffects();

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'saved-token');
    });

    it('removes token from localStorage via effect when token is null', () => {
      const service = createService();

      service.updateToken(null);
      TestBed.flushEffects();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });

    it('replaces a previous token with the new value', () => {
      const service = createService();
      service.updateToken('first-token');

      service.updateToken('second-token');

      expect(service.token$()).toBe('second-token');
    });
  });
});
