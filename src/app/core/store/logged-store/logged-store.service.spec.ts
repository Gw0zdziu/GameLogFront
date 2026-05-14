import { TestBed } from '@angular/core/testing';
import { LoggedStoreService } from './logged-store.service';

describe('LoggedStoreService', () => {
  let service: LoggedStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedStoreService);
  });

  describe('initialization', () => {
    it('isLogged$ starts as false', () => {
      expect(service.isLogged$()).toBe(false);
    });
  });

  describe('setLogged()', () => {
    it('sets isLogged$ to true', () => {
      service.setLogged(true);

      expect(service.isLogged$()).toBe(true);
    });

    it('sets isLogged$ to false', () => {
      service.setLogged(true);
      service.setLogged(false);

      expect(service.isLogged$()).toBe(false);
    });

    it('reflects the last value when called multiple times', () => {
      service.setLogged(true);
      service.setLogged(false);
      service.setLogged(true);

      expect(service.isLogged$()).toBe(true);
    });
  });
});
